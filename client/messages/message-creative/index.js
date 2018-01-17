const util = require('../send-api/util');
function MessageCreative(GraphRequest) {
  this.createMessageCreative = createMessageCreative.bind(GraphRequest);
}

/**
 * Creates a new message creative.
 * @param  {Object}  message  An object that describes the message to send.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
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
    }

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = MessageCreative;