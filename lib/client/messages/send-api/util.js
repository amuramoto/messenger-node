const templates = require('./templates');

/* Request Payload Constructor */
function RequestPayload (recipient, payload) {  
  
  if (payload.sender_action) {      
    this.sender_action = payload.sender_action;
  } else {
    this.message = parseMessageProps(payload);
    if (!this.message) { return; }
  }
  this.recipient = recipient;  
}

function AttachmentPayload (attachment, recipient) {
  let source_type = attachment.source.indexOf('http') === 0 ? 'url' : 'file';
  
  switch (source_type) {
    case 'url':
      this.attachment = {
        'type': attachment.type,
        'payload': {
          'url': attachment.source,
          'is_reusable': attachment.is_reusable || true
        }
      };  
      break;
    case 'file':
      this.formData = {      
        'message': {
          'attachment': {
            'type': attachment.type,
            'payload': {
              'is_reusable': attachment.is_reusable || true
            }
          }
        },
        'filedata': attachment.source
      }
      if (recipient) this.formData.recipient = recipient;         
      break;
  }
}

function parseMessageProps (options) {
  let message_props = {};
  if (options.attachment) message_props.attachment = options.attachment;  
  
  if (options.quick_replies) {
    message_props.quick_replies = options.quick_replies;
  }

  if (options.text) {
    message_props.text = options.text;
  }

  if (options.template_type) {
    let template = templates.getProperties(options);

    if (!template) {
      console.error('error parsing template');
      return;
    }

    message_props = {
      'attachment': {
        'type': 'template',
        'payload': template
      }
    };
  }

  return message_props;
}

module.exports = {
  parseMessageProps,
  RequestPayload,
  AttachmentPayload
};