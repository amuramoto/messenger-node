const send_api = require('./send-api'),
      platform = require('./platform');

function Client (options) {
  
  const base_url = 'https://graph.facebook.com/';
  let graph_url = base_url,
      graph_api_version = options.version || '';

  if (!options.token) {
    console.error('PAGE TOKEN REQUIRED!');
    return
  }

  if (graph_api_version) {
    this.setApiVersion(graph_api_version);
  }

  this.setPageToken = token => {
    page_token = token;
    return page_token;
  }

  this.getPageToken = () => {
    return page_token;
  }

  this.setApiVersion = version => {
    if (typeof version !== 'string' || version.indexOf('v') !== 0) {
      graph_api_version = 'v' + version;
    }
    graph_url += graph_api_version + '/';
    return graph_api_version;
  }

  this.getApiVersion = () => {
    return graph_api_version;
  }

  this.send = platform.send;

  Object.assign(this, send_api);
  // console.log(this)
}

module.exports = Client;