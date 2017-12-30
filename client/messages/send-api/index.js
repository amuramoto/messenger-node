const util = require('./util'),
      payload = {};

function sendText (options) {
  if (!options) {
    console.error('Options object required');
    return;
  }

  if (!options.text) {
    console.error('"text" property required')
    return;
  }

  return this.callSendApi(options);
}

function sendQuickReplies (options) {  
  if (!options) {
    console.error('Options object required');
    return;
  }

  if (!options.quick_replies) {
    console.error('"quick_replies" property required');
    return;
  }

  return this.callSendApi(options);
}

function sendAttachment (options) {
  if (!options) {
    console.error('Options object required');
    return;
  }

  if (!options.attachment) {
    console.error('"attachment" property required')
    return
  }
  
  return this.callSendApi(options);
}

function sendTemplate (options) {
  if (!options) {
    console.error('Options object required');
    return;
  }

  return this.callSendApi(options);
}

function sendSenderAction (options) {
  if (!options) {
    console.error('Options object required');
    return;
  }

  return this.callSendApi(options);
}

/* API Request */
function callSendApi (options) {  
  if (!options) {
    console.error('Message properties and options object required');
    return;
  }

  let request_options = {
    'path': '/me/messages',
    'payload': new util.RequestPayload(options)
  }
  
  let message_props = util.parseMessageProps(options);
  
  Object.assign(request_options.payload.message, message_props);
  // console.log(this.sendGraphRequest)
  return this.send(request_options);
}

module.exports = {
  sendQuickReplies,
  sendText,
  sendAttachment,
  sendTemplate,
  sendSenderAction,
  callSendApi  
};