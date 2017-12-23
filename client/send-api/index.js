const payload = {},
      templates = require('./templates');

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

  let message_props = {
    'text': options.text
  }

  return this.send(message_props, options);
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

  let message_props = {
    'quick_replies': options.quick_replies
  };

  if (options.text) messsage_props.text = options.text;
  if (options.attachment) messsage_props.attachment = options.attachment;
  
  return this.send(message_props, options);
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
  
  let message_props = {
    'attachment': options.attachment
  };

  return this.send(message_props, options);
}

function sendTemplate (options) {
  if (!options) {
    console.error('Options object required');
    return;
  }

  let message_props = {
    'attachment': {
      'type': 'template',
      'payload': templates.getProperties(options)
    }
  };

  return this.send(message_props, options)
}

function sendSenderAction (options) {
  if (!options) {
    console.error('Options object required');
    return;
  }

  let message_props = {
    'sender_action': options.sender_action
  };
  
  return this.send(message_props, options)
}

/* Request Payload Constructor */
function RequestPayload (options) {
  if (!options.recipient || !options.recipient.id || !options.recipient.type) {
    console.error('Invalid message recipient');
    return;
  }

  if (!options.messaging_type && new Date().getTime() >= 1525676400000) {
    console.error('messaging_type required');
    return;
  } else if (options.messaging_type) {
    this.messaging_type = options.messaging_type;   
  }

  this.message = {};
  this.recipient = {};
  this.recipient[options.recipient.type] = options.recipient.id;
  
}

/* API Request */
function send (message_props, options) {  
  if (!options) {
    console.error('Message properties and options object required');
    return;
  }

  let request_options = {
    'path': '/me/messages',
    'payload': new RequestPayload(options)
  }
  Object.assign(request_options.payload.message, message_props);
  return this.sendGraphRequest(request_options);
}

module.exports = SendApi;