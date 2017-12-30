const Broadcast = require('./broadcast'),
      SendApi = require('./send-api'),
      MessageCreative = require('./message-creative'),
      CustomLabels = require('./custom-labels'),
      SponsoredMessages = require('./sponsored-message');

function Messages (GraphRequest) {
  Object.assign(this, SendApi, Broadcast, MessageCreative, CustomLabels, SponsoredMessages);
  this.send = GraphRequest.sendGraphRequest.bind(GraphRequest);  
}

module.exports = Messages;