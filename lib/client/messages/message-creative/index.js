const util = require('../send-api/util');
function MessageCreative(GraphRequest) {
  this.createMessageCreative = createMessageCreative.bind(GraphRequest);
}

/**
 * Creates a new message creative.
 * @param  {Object}  message  An object that describes the message to send.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example <caption>Text Message</caption> 
 * let message = {'text': 'my text message'};
 * Client.createMessageCreative(message)
 *   .then(res => {
 *     console.log(res); // {"message_creative_id": "953434576932424"}
 *   });
 * @example <caption>Template Message</caption> 
 * let message = {
 *   template_type: 'generic',
 *   elements: [
 *     {
 *       'title':'This is a generic template',
 *       'subtitle':'Plus a subtitle!',
 *       'image_url':'https://www.example.com/dog.jpg',
 *       'buttons':[
 *         {
 *           'type':'postback',
 *           'title':'Postback Button',
 *           'payload':'postback_payload'
 *         },
 *         {
 *           'type': 'web_url',
 *           'title': 'URL Button',
 *           'url': 'https://www.example.com/'
 *         }
 *       ]      
 *     }
 *   ]
 * };
 * Client.createMessageCreative(message)
 *   .then(res => {
 *     console.log(res); // {"message_creative_id": "953434576932424"}
 *   });
 */
function createMessageCreative (message) {
  return new Promise (async (resolve, reject) => {
    if (!message) {
      reject('Valid message object required');      
    }
    
    let request_options = {
      'api_version': 'v2.11',
      'path': '/me/message_creatives',
      'payload': {
        'messages': [util.parseMessageProps(message)]
      }
    };

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = MessageCreative;