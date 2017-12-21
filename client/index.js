const request = require('request'),
      send_api = require('./send-api'),
      platform = require('./platform'),
      env = require('../env');

module.exports = Client;

function Client (version, token) {
  
  const base_url = 'https://graph.facebook.com/';
  
  let page_token = token,
      graph_api_version = version || '2.11',
      graph_url = base_url + graph_api_version;
  
  if (!page_token) {
    console.error('PAGE TOKEN REQUIRED!');
    return
  }

  this.setPageToken = (token) => {
    page_token = token;
    return page_token;
  }

  this.getPageToken = () => {
    return page_token;
  }

  Object.assign(this, platform, send_api);
}