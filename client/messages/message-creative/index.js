const util = require('../send-api/util');

async function createMessageCreative (message) {
  if (!message) {
    console.error('Valid message object required');
    return;
  }
  
  let request_options = {
    'api_version': 'v2.11',
    'path': '/me/message_creatives',
    'payload': {
      'messages': [util.parseMessageProps(message)]
    }
  }

  return this.sendGraphRequest(request_options);
}

module.exports = {
  createMessageCreative
};