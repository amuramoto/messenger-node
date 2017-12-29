const util = require('../send-api/util');

function MessageCreative (GraphRequest) {
  this.create = create.bind(GraphRequest);
}

async function create (message) {
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

module.exports = MessageCreative;