const util = require('../send-api/util');

async function createMessageCreative (message) {
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
      let response = await this.send(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  createMessageCreative
};