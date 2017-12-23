const SendApi = require('./send-api'),
      GraphRequest = require('./graph-api'),
      MessengerProfile = require('./messenger-profile-api');

function Client (options) {
  this.GraphRequest = new GraphRequest(options);
  this.setPageToken = this.GraphRequest.setPageToken;
  this.getPageToken = this.GraphRequest.page_token;
  this.setApiVersion = this.GraphRequest.setApiVersion;
  this.getApiVersion = this.GraphRequest.graphApiVersion;

  this.Message = new SendApi(this.GraphRequest);
  this.MessengerProfile = new MessengerProfile(this.GraphRequest)


}

module.exports = Client;