'use strict';

const express = require('express'),
      body_parser = require('body-parser'),
      app = express().use(body_parser.json()),
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
    verifyWebhook(mode, token, challenge);
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

  if (webhook_event.message) {
    let message = webhook_event.message;
    if (message.text) {      
      if (message.quick_reply) {
        // messages - quick_reply  
        emitter.emit('messages');
      } else {
        // messages - text    
        emitter.emit('messages');
      }
    } else if (message.attachments) {
      // messages - attachment
      emitter.emit('messages');

    } else if (message.is_echo) {
      //messaging_echoes
      emitter.emit('messaging_echoes');

    }          
  } else if (webhook_event.postback) {
    // messaging_postbacks
    emitter.emit('messaging_postbacks');

  } else if (webhook_event.standby) {
    // standby
    emitter.emit('standby');

  } else if (webhook_event.delivery) {
    // messaging_deliveries
    emitter.emit('messaging_deliveries');

  } else if (webhook_event.read) {
    // messaging_reads
    emitter.emit('messaging_reads');
    
  } else if (webhook_event.account_linking) {
    // messaging_account_linking
    emitter.emit('messaging_account_linking');

  } else if (webhook_event.optin) {
    // messaging_optins
    emitter.emit('messaging_optins');

  } else if (webhook_event.referral) {
    // messaging_referrals
    emitter.emit('messaging_referrals');

  } else if (webhook_event.pass_thread_control || webhook_event.take_thread_control) {
    // messaging_handovers
    emitter.emit('messaging_handovers');

  } else if (webhook_event.policy-enforcement) {
    // messaging_policy_enforcement
    emitter.emit('messaging_policy_enforcement');

  } else if (webhook_event.payment) {
    // messaging_payments
    emitter.emit('messaging_payments');

  } else if (webhook_event.pre_checkout) {
    // messaging_pre_checkouts
    emitter.emit('messaging_pre_checkouts');

  } else if (webhook_event.checkout_update) {
    // messaging_checkout_updates
    emitter.emit('messaging_checkout_updates');

  } else if (webhook_event.game_play) {
    // messaging_game_plays
    emitter.emit('messaging_game_plays');
  } else {
    // unknown event
    console.error("Webhook received unknown messagingEvent: ", webhook_event);
    emitter.emit('unknown_event');
  }
}

function verifyWebhook(mode, token, challenge) {
  console.log('Verifying webhook...');          
  // Check the mode and token sent are correct
  if (mode === 'subscribe' && token === verify_token) {      
    // Respond with 200 OK and challenge token from the request
    console.log('Webhook verification: SUCCESS');
    res.status(200).send(challenge);

  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    throw 'Webhook verification: FAILED. Check that your verify_token is set correctly.';
    res.sendStatus(403);      
  }
}