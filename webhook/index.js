const express = require('express'),
      body_parser = require('body-parser'),      
      util = require('./util');

function Webhook (options) {
  let app,
      server,
      port = options.port || process.env.PORT || 1337,
      endpoint = options.endpoint || process.env.ENDPOINT || '/webhook',
      verify_token = options.verify_token || process.env.VERIFY_TOKEN;
  
  if (!verify_token) throw 'VERIFY_TOKEN required to create webhook!';
  if (endpoint.indexOf('/') !== 0) endpoint = '/' + endpoint;

  app = express().use(body_parser.json());  
  addWebhookEndpoint(endpoint, app);
  addVerifyEndpoint(verify_token, endpoint, app);
  
  server = app.listen(port, () => {    
    console.log('webhook is listening on port ' + port);
  });

  this.on = (event_name, callback) => {
     app.on(event_name, callback);
  }
  this.emit = app.emit;
  this.getInstance = () => { return app };
  this.stopInstance = (callback) => server.close(callback);
  this.getPort = () => { return port };
  this.getEndpoint = () => { return endpoint };
  this.getVerifyToken = () => { return verify_token };
}

function addVerifyEndpoint (verify_token, endpoint, app) {
  app.get(endpoint, (req, res) => {
    // Parse params from the verification request
    let verification = util.verifyWebhook(verify_token, req.query);
    if (!verification) {
      res.sendStatus(403);
    }
    res.status(200).send(req.query['hub.challenge']);
  });

  return;
}

function addWebhookEndpoint (endpoint, app) {
  
  app.post(endpoint, (req, res) => {  
    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page' && body.entry) {

      body.entry.forEach(entry => {
        let webhook_event = entry.messaging[0];        
        let sender_id = util.parseSenderId(webhook_event.sender);
        let event_type = util.parseEventType(webhook_event);
        app.emit(event_type.type, event_type, sender_id, webhook_event)
      });

      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
      
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  });

  return;
}

module.exports = Webhook;