const SendApi = require('./send-api'),
      GraphRequest = require('./graph-api'),
      MessengerProfile = require('./messenger-profile'),
      Person = require('./person'),
      Labels = require('./custom-labels'),
      Broadcast = require('./broadcast-api'),
      MessengerCode = require('./messenger-code-api'),
      MessagingInsights = require('./messaging-insights-api');

function Client (options) {
  this.GraphRequest = new GraphRequest(options);
  this.setPageToken = this.GraphRequest.setPageToken;
  this.getPageToken = this.GraphRequest.getPageToken;
  this.setApiVersion = this.GraphRequest.setApiVersion;
  this.getApiVersion = this.GraphRequest.graphApiVersion;

  this.Message = new SendApi(this.GraphRequest);
  this.MessengerProfile = new MessengerProfile(this.GraphRequest);
  this.Person = new Person(this.GraphRequest);
  this.Labels = new Labels(this.GraphRequest);
  this.Broadcast = new Broadcast(this.GraphRequest);
  this.MessengerCode = new MessengerCode(this.GraphRequest);
  this.MessagingInsights = new MessagingInsights(this.GraphRequest);
}

module.exports = Client;