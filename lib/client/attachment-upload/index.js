function Attachment (GraphRequest) {    
  this.uploadAttachment = uploadAttachment.bind(GraphRequest);  
}

/**
 * Uploads media using the Attachment Upload API.
 * @param {String} type The attachment type. Must be `url` or `file`.
 * @param {String} source The location of the attachment. A URL or file path.
 * @returns {Promise<Object>} The API response 
 * @memberof Client#
 * @example <caption>Upload from URL</caption> 
 * Client.uploadAttachment('url', 'https://www.example.com/image.jpg')
 *  .then(res => {
 *     console.log(res) // {'attachment_id': 09754203957254}
 *  });
 * @example <caption>Upload from file</caption> 
 * Client.uploadAttachment('file', '/User/Me/Desktop/video.mp4')
 *  .then(res => {
 *     console.log(res); // {'attachment_id': 09754203957254}
 *  });
 */
function uploadAttachment(type, source) {
  return new Promise (async (resolve, reject) => {
    if (!type || !source) {
      reject('Valid attachment type and source required');
    }

    let formData = {};

    let request_options = {
      'path': '/me/message_attachments'
    };

    let source_type = source.indexOf('http') >= 0 ? 'url':'file';

    let payload = {
      'message': {
        'attachment': {
          'type': type,
          'payload': {             
            'is_reusable': true
          }
        }
      }
    };

    switch (source_type) {
      case 'url':
        payload.message.attachment.payload.url = source;
        request_options.payload = payload;      
        break;
      case 'file':
        formData.message = payload.message;
        formData.filedata = source;
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
