module.exports = {
  verifyWebhook: verifyWebhook,
  parseEventType: parseEventType
}

function verifyWebhook(qs) {
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