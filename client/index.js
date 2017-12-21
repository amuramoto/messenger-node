const send_api = require('./send-api'),
      platform = require('./platform');

function Client (options) {
  
  const base_url = 'https://graph.facebook.com/';
  
  this.graph_url = base_url;

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

  Object.assign(this, platform, send_api);

}

module.exports = Client;