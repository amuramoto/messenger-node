const util = require('./util'),
      payload = {};

function SendApi (GraphRequest) {
  this.sendQuickReplies = sendQuickReplies;
  this.sendText = sendText;
  this.sendAttachment = sendAttachment;
  this.sendTemplate = sendTemplate;
  this.sendSenderAction = sendSenderAction;
  this.send = send.bind(GraphRequest);
}



function sendText (options, callback) {
  if (!options) {
    console.error('Options object required');
    return;
  }

  if (!options.text) {
    console.error('"text" property required')
    return;
  }

  return this.send(options);
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

  return this.send(options);
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
  
  return this.send(options);
}

function sendTemplate (options) {
  if (!options) {
    console.error('Options object required');
    return;
  }

  return this.send(options);
}

function sendSenderAction (options) {
  if (!options) {
    console.error('Options object required');
    return;
  }

  return this.send(options);
}

/* API Request */
function send (options) {  
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
  
  return this.sendGraphRequest(request_options);
}

module.exports = SendApi;