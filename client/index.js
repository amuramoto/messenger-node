const GraphRequest = require('./graph-api'),
      Messages = require('./messages'),
      MessengerProfile = require('./messenger-profile'),
      Person = require('./person'),
      MessengerCode = require('./messenger-codes'),
      MessagingInsights = require('./messaging-insights'),
      Attachment = require('./attachment-upload');      

function Client (options) {
  this.GraphRequest = new GraphRequest(options);
  this.setPageToken = this.GraphRequest.setPageToken;
  this.getPageToken = this.GraphRequest.getPageToken;
  this.setApiVersion = this.GraphRequest.setApiVersion;
  this.getApiVersion = this.GraphRequest.graphApiVersion;

  this.Message = new Messages(this.GraphRequest);
  this.MessengerProfile = new MessengerProfile(this.GraphRequest);
  this.Person = new Person(this.GraphRequest);
  this.MessengerCode = new MessengerCode(this.GraphRequest);
  this.MessagingInsights = new MessagingInsights(this.GraphRequest);
  this.Attachment = new Attachment(this.GraphRequest);  
}

module.exports = Client;