function Attachment (GraphRequest) {
  this.upload = upload.bind(GraphRequest);  
}

function upload(options) {
  return new Promise (async (resolve, reject) => {
    if (!options.type) {
      reject('Valid type property required');
    }

    if (!options.file && !options.url) {
      reject('Valid file or url property required');
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
      formData.message = JSON.stringify(payload.message);
      formData.filedata = `${options.file}`
      request_options.formData = formData;
    }

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = Attachment;
