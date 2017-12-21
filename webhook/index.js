const express = require('express'),
      body_parser = require('body-parser'),      
      util = require('./util'),      
      env = require('../env');

function Webhook (options) {
  // verify_token required
  if (!env.VERIFY_TOKEN && !options.verify_token) throw 'VERIFY_TOKEN required to create webhook!';
  
  let app = express().use(body_parser.json());        
  addWebhookEndpoint(options, app);
  addVerifyEndpoint(options.verify_token, app);
  app.listen(options.port || process.env.PORT, () => {    
    console.log('webhook is listening')
  });

  return app;
}

function addVerifyEndpoint (verify_token, app) {
  app.get('/webhook', (req, res) => {
    // Parse params from the verification request
    let verification = util.verifyWebhook(verify_token, req.query);
    if (!verification) {
      res.sendStatus(403);
    }
    res.status(200).send(challenge);
  });

  return;
}

function addWebhookEndpoint (options, app) {
  let endpoint = options.endpoint || '/webhook',
      port = options.port || process.env.PORT,        
      logging = options.logging;
  // Accepts POST requests at /webhook endpoint
  app.post('/webhook', (req, res) => {  

    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page' && body.entry) {

      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');

      body.entry.forEach(entry => {
        let webhook_event = entry.messaging[0];        
        let sender = parseSenderId(webhook_event.sender);
        let event_type = util.parseEventType(webhook_event);

        if (logging) console.log('EVENT RECEIVED:\n' + webhook_event);
        
        app.emit(event_type, sender, webhook_event)
      });
      
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  });

  return;
}

module.exports = Webhook;