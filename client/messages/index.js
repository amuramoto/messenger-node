const BroadcastApi = require('./broadcast-api'),
      SendApi = require('./send-api'),
      MessageCreative = require('./message-creative'),
      CustomLabels = require('./custom-labels'),
      SponsoredMessagesApi = require('./sponsored-message');

function Messages (GraphRequest) {
  Object.assign(this, SendApi, BroadcastApi, MessageCreative, CustomLabels, SponsoredMessagesApi);
  this.send = send.bind(GraphRequest);  
}

function send (request_options) {
  return this.sendGraphRequest(request_options);
}

module.exports = Messages;