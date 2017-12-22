const payload = {},
      platform = require('./platform'),
      templates = require('./templates');

function SendApiPayload (options) {
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

function callSendApi (message_props, options) {
  let payload = new SendApiPayload(options);
  Object.assign(payload.message, message_props);
  return this.send('/messages', payload);
}

function sendText (options, callback) {

  if (!options.text) {
    console.error('"text" property required')
    return;
  }

  let message_props = {
    'text': options.text
  }

  return this.callSendApi(message_props, options);
}

function sendQuickReplies (options) {  
  if (!options.quick_replies) {
    console.error('"quick_replies" property required');
    return;
  }

  let message_props = {
    'quick_replies': options.quick_replies
  };

  if (options.text) messsage_props.text = options.text;
  if (options.attachment) messsage_props.attachment = options.attachment;
  
  return this.callSendApi(message_props, options);
}

function sendAttachment (options) {
  if (!options.attachment) {
    console.error('"attachment" property required')
    return
  }
  
  let message_props = {
    'attachment': options.attachment
  };

  return this.callSendApi(message_props, options);
}

function sendTemplate (options) {
  let message_props = {
    'attachment': {
      'type': 'template',
      'payload': templates.getProperties(options)
    }
  };
  
  return this.callSendApi(message_props, options)
}


function sendSenderAction (options) {

}



module.exports = {
  sendQuickReplies,
  sendText,
  sendAttachment,
  sendTemplate,
  sendSenderAction,
  callSendApi
}