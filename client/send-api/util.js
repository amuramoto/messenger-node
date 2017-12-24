const templates = require('./templates');

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

function parseMessageProps (options) {
  let message_props = {}
if (options.attachment) messsage_props.attachment = options.attachment;  
  
  if (options.text) {
    message_props = {'text': options.text};
  } else if (options.quick_replies) {
    message_props = {
      'quick_replies': options.quick_replies
    };

    if (options.text) messsage_props.text = options.text;    
  } else if (options.template_type) {
    message_props = {
      'attachment': {
        'type': 'template',
        'payload': templates.getProperties(options)
      }
    };
  } else if (options.sender_action) {
    message_props = {
      'sender_action': options.sender_action
    };
  }

  return message_props;
}

module.exports = {
  parseMessageProps,
  RequestPayload
}