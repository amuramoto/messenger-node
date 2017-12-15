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
    let mode = req.query['hub.mode'],
        token = req.query['hub.verify_token'],
        challenge = req.query['hub.challenge'];
    util.verifyWebhook(mode, token, challenge);
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
  if (event_type === 'messages') {
    let message = webhook_event.message;
    if (message.text) {      
      if (message.quick_reply) {
        // messages - quick_reply  
        
      } else {
        // messages - text    
        
      }
    } else if (message.attachments) {
      // messages - attachment
      

    } else if (message.is_echo) {
      //messaging_echoes
      

    }          
  } else if (event_type === 'messaging_postbacks') {
    // messaging_postbacks
    

  } else if (event_type === 'standby') {
    // standby
    

  } else if (event_type === 'messaging_deliveries') {
    // messaging_deliveries
    

  } else if (event_type === 'messaging_reads') {
    // messaging_reads
    
    
  } else if (event_type === 'messaging_account_linking') {
    // messaging_account_linking
    

  } else if (event_type === 'messaging_optins') {
    // messaging_optins
    

  } else if (event_type === 'messaging_referrals') {
    // messaging_referrals
   

  } else if (event_type === 'messaging_handovers') {
    // messaging_handovers
   

  } else if (event_type === 'messaging_policy_enforcement') {
    // messaging_policy_enforcement
   

  } else if (event_type === 'messaging_payments') {
    // messaging_payments
   

  } else if (event_type === 'messaging_pre_checkouts') {
    // messaging_pre_checkouts
    

  } else if (event_type === 'messaging_checkout_updates') {
    // messaging_checkout_updates
   

  } else if (event_type === messaging_game_plays) {
    // messaging_game_plays
   
  }

  emitter.emit(event_type)
}

