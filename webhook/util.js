module.exports = {
  verifyWebhook: verifyWebhook,
  parseEventType: parseEventType
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

function parseEventType (webhook_event) {
  let event_type;
  if (webhook_event.message) {
    event_type = 'messages';          
  } else if (webhook_event.postback) {
    // messaging_postbacks
    event_type = 'messaging_postbacks';
  } else if (webhook_event.standby) {
    // standby
    event_type = 'standby';
  } else if (webhook_event.delivery) {
    // messaging_deliveries
    event_type = 'messaging_deliveries';
  } else if (webhook_event.read) {
    // messaging_reads
    event_type = 'messaging_reads';    
  } else if (webhook_event.account_linking) {
    // messaging_account_linking
    event_type = 'messaging_account_linking';
  } else if (webhook_event.optin) {
    // messaging_optins
    event_type = 'messaging_optins';
  } else if (webhook_event.referral) {
    // messaging_referrals
    event_type = 'messaging_referrals';
  } else if (webhook_event.pass_thread_control || webhook_event.take_thread_control) {
    // messaging_handovers
    event_type = 'messaging_handovers';
  } else if (webhook_event.policy-enforcement) {
    // messaging_policy_enforcement
    event_type = 'messaging_policy_enforcement';
  } else if (webhook_event.payment) {
    // messaging_payments
    event_type = 'messaging_payments';
  } else if (webhook_event.pre_checkout) {
    // messaging_pre_checkouts
    event_type = 'messaging_pre_checkouts';
  } else if (webhook_event.checkout_update) {
    // messaging_checkout_updates
    event_type = 'messaging_checkout_updates';
  } else if (webhook_event.game_play) {
    // messaging_game_plays
    event_type = 'messaging_game_plays';
  } else {
    // unknown event
    console.error("Webhook received unknown messagingEvent: ", webhook_event);
    event_type = 'unknown_event';
  }
}