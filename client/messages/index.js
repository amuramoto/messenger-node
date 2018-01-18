const Broadcast = require('./broadcast'),
      SendApi = require('./send-api'),
      MessageCreative = require('./message-creative'),
      CustomLabels = require('./custom-labels'),
      SponsoredMessage = require('./sponsored-message');

function Messages (GraphRequest) {
  Object.assign(
    this, 
    new SendApi(GraphRequest), 
    new Broadcast(GraphRequest), 
    new MessageCreative(GraphRequest), 
    new CustomLabels(GraphRequest), 
    new SponsoredMessage(GraphRequest)
  );  
}

module.exports = Messages;