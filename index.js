'use strict';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const 
  env = require('./env'),
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()),
  Rx = require('rxjs/Rx');

exports = module.exports = createWebhook;

function createWebhook(options) {
  let endpoint = options.endpoint || '/webhook';
  let port = options.port || process.env.PORT;  
  let verify_token = options.verify_token;
  let logging = options.logging;
  
  // verify_token required
  if (!verify_token) throw 'VERIFY_TOKEN REQUIRED';
  
  // Sets server port and logs message on success
  app.listen(port || process.env.PORT, () => console.log('webhook is listening'));

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
        emitEventType(webhook_event)
      });
      
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }

  });

  app.get('/webhook', (req, res) => {
    // Parse params from the verification request
    let mode = req.query['hub.mode'],
        token = req.query['hub.verify_token'],
        challenge = req.query['hub.challenge'];
    verifyWebhook(mode, token, challenge);
  });

  return app;
}

function emitEvent (webhook_event) {
  if (webhook_event.message) {
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

  } else if (webhook_event.postback) {
    // messaging_postbacks

  } else if (webhook_event.standby) {
    // standby

  } else if (webhook_event.delivery) {
    // messaging_deliveries

  } else if (webhook_event.read) {
    // messaging_reads
    
  } else if (webhook_event.account_linking) {
    // messaging_account_linking

  } else if (webhook_event.optin) {
    // messaging_optins

  } else if (webhook_event.referral) {
    // messaging_referrals

  } else if (webhook_event.pass_thread_control || webhook_event.take_thread_control) {
    // messaging_handovers

  } else if (webhook_event.policy-enforcement) {
    // messaging_policy_enforcement

  } else if (webhook_event.payment) {
    // messaging_payments

  } else if (webhook_event.pre_checkout) {
    // messaging_pre_checkouts

  } else if (webhook_event.checkout_update) {
    // messaging_checkout_updates

  } else if (webhook_event.game_play) {
    // messaging_game_plays
  } else {
    // unknown event
    console.error("Webhook received unknown messagingEvent: ", webhook_event);
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


function handleMessage(sender_psid, received_message) {
  let response;
  
  // Checks if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  
  // Send the response message
  callSendAPI(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}


