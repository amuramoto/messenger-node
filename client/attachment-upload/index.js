function Attachment (GraphRequest) {
  this.upload = upload.bind(GraphRequest);  
}

function upload(options) {
  if (!options.type) {
    console.error('Valid type property required');
    return;
  }

  if (!options.file && !options.url) {
    console.error('Valid file or url property required');
    return;
  }

  let formData = {};

  let request_options = {
    'path': '/me/message_attachments'
  }

  let payload = {
    'message': {
      'attachment': {
        'type': options.type,
        'payload': {             
          'is_reusable': true
        }
      }
    }
  }

  if (options.url) {
    payload.message.attachment.payload.url = options.url;
    request_options.payload = payload;
  } else if (options.file) {
    if (!options.file) {
      console.error('Valid file property required');
      return;
    }
    formData.message = JSON.stringify(payload.message);
    formData.filedata = `${options.file}`
    request_options.formData = formData;
  }

  return this.sendGraphRequest(request_options);
}

module.exports = Attachment;
