const util = require('../messages/send-api/util');

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
function uploadAttachment(attachment) {
  return new Promise (async (resolve, reject) => {
    if (!attachment) {
      reject('Valid attachment object required');
    }

    let request_options = {
      'path': '/me/message_attachments'
    };

    let AttachmentPayload = new util.AttachmentPayload(attachment);

    if (!AttachmentPayload) reject('Valid URL or file required');

    if (AttachmentPayload.formData) {
      request_options.formData = AttachmentPayload.formData;
    } else {
      request_options.payload = AttachmentPayload.payload;
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
