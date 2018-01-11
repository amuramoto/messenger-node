function Attachment (GraphRequest) {
  /**
   * Uploads media using the Attachment Upload API
   * @param {Object} options The attachment details
   * @param {String} options.source_type The source of the attachment. Must be `url` or `file`.
   * 
   * @memberof Client#
   */
  this.uploadAttachment = upload.bind(GraphRequest);  
}

function upload(type, source) {
  return new Promise (async (resolve, reject) => {
    if (!type || !source) {
      reject('Valid attachment type and source required');
    }

    let formData = {};

    let request_options = {
      'path': '/me/message_attachments'
    }

    let source_type = source.indexOf('http') >= 0 ? 'url':'file'

    let payload = {
      'message': {
        'attachment': {
          'type': type,
          'payload': {             
            'is_reusable': true
          }
        }
      }
    }

    switch (source_type) {
      case 'url':
        payload.message.attachment.payload.url = source;
        request_options.payload = payload;      
        break;
      case 'file':
        formData.message = JSON.stringify(payload.message);
        formData.filedata = `${source}`
        request_options.formData = formData;
        break;
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
