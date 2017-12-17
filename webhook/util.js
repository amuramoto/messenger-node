module.exports = {
  addWebhookVerification: addWebhookVerification,
  addWebhookReceiver: addWebhookReceiver
}

function addWebhookVerification (verify_token, app) {
  app.get('/webhook', (req, res) => {
    // Parse params from the verification request
    let verification = verifyWebhook(verify_token, req.query);
    if (!verification) {
      res.sendStatus(403);
    }
    res.status(200).send(challenge);
  });

  return;
}

function addWebhookReceiver (eventEmitter, app, options) {
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
        if (logging) console.log('EVENT RECEIVED:\n' + webhook_event);
        emitWebhookEvent(eventEmitter, webhook_event);
      });
      
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  });

  return;
}

function emitWebhookEvent (eventEmitter, webhook_event) {      
  let sender = parseSenderId(webhook_event.sender);
  let event = {
    'type': util.parseEventType(webhook_event),
    'subtype': null
  }  
  
  if (event.type === 'messages') {
    let message = webhook_event.message;
    if (message.text) {      
      if (message.quick_reply) {
        // messages - quick_reply  
        event.subtype = 'quick_reply';
      } else {
        // messages - text    
        event.subtype = 'text';
      }
    } else if (message.attachments) {
      // messages - attachment      
      event.subtype = 'attachments';
   }            
  } else if (event.type === 'messaging_referrals') {
    // messaging_referrals - source
    event.subtype = webhook_event.referral.source;    
  } else if (event.type === 'messaging_handovers') {    
    if (webhook_event.pass_thread_control) {
      // messaging_handovers - pass_thread_control
      event.subtype = 'pass_thread_control';
    } else if (webhook_event.take_thread_control) {
      // messaging_handovers - take_thread_control
      event.subtype = 'take_thread_control';
    } else if (webhook_event.app_roles) {
      // messaging_handovers - app_roles
      event.subtype = 'app_roles';
    }   
  }
  eventEmitter.emit(event, sender, webhook_event);
}

function verifyWebhook(verify_token, qs) {
  const mode = qs['hub.mode'],
        token = qs['hub.verify_token'],
        challenge = qs['hub.challenge']
  console.log('Verifying webhook...');          
  // Check the mode and token sent are correct
  if (mode === 'subscribe' && token === verify_token) {      
    console.log('Webhook verification: SUCCESS');
    return true;
  }
  console.error('Webhook verification: FAILED. Check that your verify_token is set correctly.');
  return false; 
}

function parseSenderId(sender_info) {
  let sender_id = {'type': '', 'id': ''};
  if (sender_info.id) {
    sender_id.id = sender_info.id;
    sender_info.type = 'psid';
  } else if (sender_info.phone_number) {
    sender_id.id = sender_info.phone_number;
    sender_info.type = 'phone_number';
  } else if (sender_info.user_ref) {
    sender_id.id = sender_info.user_ref;
    sender_info.type = 'user_ref';
  }
  return sender_id;
}

function parseEventType (webhook_event) {
  if (webhook_event.message) {
    if (message.is_echo) {
      return 'messaging_echoes';           
    }
    return 'messages';          
  } else if (webhook_event.postback) {
    return 'messaging_postbacks';
  } else if (webhook_event.standby) {
    return 'standby';
  } else if (webhook_event.delivery) {
    return 'messaging_deliveries';
  } else if (webhook_event.read) {
    return 'messaging_reads';    
  } else if (webhook_event.account_linking) {
    return 'messaging_account_linking';
  } else if (webhook_event.optin) {
    return 'messaging_optins';
  } else if (webhook_event.referral) {
    return 'messaging_referrals';
  } else if (webhook_event.pass_thread_control || webhook_event.take_thread_control) {
    return 'messaging_handovers';
  } else if (webhook_event.policy-enforcement) {
    return 'messaging_policy_enforcement';
  } else if (webhook_event.payment) {
    return 'messaging_payments';
  } else if (webhook_event.pre_checkout) {
    return 'messaging_pre_checkouts';
  } else if (webhook_event.checkout_update) {
    return 'messaging_checkout_updates';
  } else if (webhook_event.game_play) {
    return 'messaging_game_plays';
  } else {
    console.error("Webhook received unknown messagingEvent: ", webhook_event);
    return 'unknown_event';
  }
}
