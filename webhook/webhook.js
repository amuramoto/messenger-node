'use strict';

const express = require('express'),
      body_parser = require('body-parser'),
      app = express().use(body_parser.json()),
      util = require('./util'),
      EventEmitter = require('events'),
      emitter = new EventEmitter();

module.exports = {
  createWebhook: createWebhook,
  emitter: emitter,
  getWebhookInstance: getWebhookInstance
}

function createWebhook (options) {
  let endpoint = options.endpoint || '/webhook';
  let port = options.port || process.env.PORT;  
  let verify_token = options.verify_token;
  let logging = options.logging;
  
  // verify_token required
  if (!verify_token) throw 'VERIFY_TOKEN REQUIRED';

  // Sets server port and logs message on success
  app.listen(port || process.env.PORT, () => console.log('webhook is listening'));
  addWebhookReceiver();
  addWebhookVerification();
  return app;
}


function getWebhookInstance () {
  return app;
}

function addWebhookVerification () {
  let app = getWebhookInstance();
  app.get('/webhook', (req, res) => {
    // Parse params from the verification request
    let verification = util.verifyWebhook(req.query);

    if (!verification) {
      res.sendStatus(403);
    }
    res.status(200).send(challenge);
  });
}

function addWebhookReceiver () {
  let app = getWebhookInstance();
  // Accepts POST requests at /webhook endpoint
  app.post('/webhook', (req, res) => {  
    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page' && body.entry) {

      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');

      body.entry.forEach(entry => {
        let webhook_event = entry.messaging[0];        
        if (logging) console.log('EVENT RECEIVED:\n' + webhook_event);
        emitWebhookEvent(webhook_event);
      });
      
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }

  });
}

function emitWebhookEvent (webhook_event) {
  let event_type = util.parseEventType(webhook_event);
  let event_subtype = null;
  if (event_type === 'messages') {
    let message = webhook_event.message;
    if (message.text) {      
      if (message.quick_reply) {
        // messages - quick_reply  
        event_subtype = 'quick_reply';
      } else {
        // messages - text    
        event_subtype = 'text';
      }
    } else if (message.attachments) {
      // messages - attachment      
      event_subtype = 'attachments';
   }            
  } else if (event_type === 'messaging_referrals') {
    // messaging_referrals - source
    event_subtype = webhook_event.referral.source;    
  } else if (event_type === 'messaging_handovers') {    
    if (webhook_event.pass_thread_control) {
      // messaging_handovers - pass_thread_control
      event_subtype = 'pass_thread_control';
    } else if (webhook_event.take_thread_control) {
      // messaging_handovers - take_thread_control
      event_subtype = 'take_thread_control';
    } else if (webhook_event.app_roles) {
      // messaging_handovers - app_roles
      event_subtype = 'app_roles';
    }   
  }
  emitter.emit(event_type, event_subtype, webhook_event);
}

