const send_api = require('./send-api'),
      platform = require('./platform'),
      MessengerProfile = require('./messenger-profile-api');

function Client (options) {
  
  this.graph_url = 'https://graph.facebook.com/';

  this.graph_api_version = options.version || '';

  this.setPageToken = token => {
    this.page_token = token;
    return this.page_token;
  }

  this.getPageToken = () => {
    return this.page_token;
  }

  this.setApiVersion = version => {
    if (typeof version !== 'string' || version.indexOf('v') !== 0) {
      this.graph_api_version = 'v' + version;
    }
    this.graph_url += this.graph_api_version + '/';
    return graph_api_version;
  }

  this.getApiVersion = () => {
    return this.graph_api_version;
  }

  if (!options.token) {
    console.error('PAGE TOKEN REQUIRED!');
    return
  }

  this.setPageToken(options.token)

  if (this.graph_api_version) {
    this.setApiVersion(this.graph_api_version);
  }

  this.MessengerProfile = new MessengerProfile();


  Object.assign(this, platform, send_api);

}

module.exports = Client;