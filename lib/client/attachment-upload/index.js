const util = require('../messages/send-api/util');

function Attachment (GraphRequest) {    
  this.uploadAttachment = uploadAttachment.bind(GraphRequest);  
}

/**
 * Uploads media using the Attachment Upload API.
 * @param  {Object}  attachment  An object that describes the attachment to send.
 * @param {String}  attachment.type  The type of asset being upload. Must be `image`, `video`, `audio`, or `file`.
 * @param {String}  attachment.source  The location of the asset. Must be a valid URL or complete filesystem location.
 * @param {String}  attachment.is_reusable  __Optional.__ Set to `true` to return a reusable attachment ID.
 * @returns {Promise<Object>} The API response 
 * @memberof Client#
 * @example <caption>Upload from URL</caption> 
 * let recipient = {'id': '57024957309673'},
 *     attachment = {
 *       'type':'image', 
 *        'source':'https://www.example.com/dog.png', 
 *        'is_reusable':true           
 *     }
 * Client.uploadAttachment('url', 'https://www.example.com/image.jpg')
 *  .then(res => {
 *     console.log(res) // {'attachment_id': 09754203957254}
 *  });
 * @example <caption>Upload from file</caption> 
 * let recipient = {'id': '57024957309673'},
 *     attachment = {
 *       'type':'image', 
 *        'source':'/Users/me/Desktop/dog.jpg', 
 *        'is_reusable':true           
 *     }
 * Client.uploadAttachment(attachment)
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
      request_options.payload = { 'message': AttachmentPayload };
    }
console.log(request_options)
    try {
      let response = await this.sendGraphRequest(request_options);      
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = Attachment;
