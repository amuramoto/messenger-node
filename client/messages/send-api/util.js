const templates = require('./templates');

/* Request Payload Constructor */
function RequestPayload (recipient, payload) {  
  
  if (payload.sender_action) {      
    console.log('ok')
    this.sender_action = payload.sender_action;
  } else {
    this.message = parseMessageProps(payload);
  }
  this.recipient = recipient;  
}

function parseMessageProps (options) {
  let message_props = {}
  if (options.attachment) message_props.attachment = options.attachment;  
  
  if (options.quick_replies) {
    console.log('ok')
    message_props.quick_replies = options.quick_replies
  }

  if (options.text) {
    message_props.text = options.text;
  }

  if (options.template_type) {
    message_props = {
      'attachment': {
        'type': 'template',
        'payload': templates.getProperties(options)
      }
    };
  }

  return message_props;
}

module.exports = {
  parseMessageProps,
  RequestPayload
}