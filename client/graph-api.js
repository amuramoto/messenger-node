const request = require('request');

function GraphRequest(options) {  

  if (!options.page_token) {
    console.error('PAGE TOKEN REQUIRED!');
    return
  }

  var page_token = options.page_token,
      app_token = options.app_token,
      graph_url = 'https://graph.facebook.com/',
      graph_api_version = options.graph_api_version || process.env.GRAPH_API_VERSION || '';
  

  this.getGraphUrl = () => {return graph_url;}

  this.setPageToken = token => {
    page_token = token;
    return this.page_token;
  }

  this.getPageToken = () => {return page_token;}

  this.setAppToken = token => {
    this.app_token = token;
    return this.app_token;
  }

  this.getAppToken = () => {return app_token;}

  this.setApiVersion = version => {
    if (typeof version !== 'string' || version.indexOf('v') !== 0) {
      graph_api_version = 'v' + version;
    }
    graph_url += this.graph_api_version + '/';
    return graph_api_version;
  }

  if (this.graph_api_version) {
    this.setApiVersion(this.graph_api_version);
  }

  this.sendGraphRequest = sendGraphRequest;
}

function sendGraphRequest (options, callback) {

  let promise;
  const method = options.payload ? 'POST' : 'GET';
        qs = options.qs || {},
        request_options = {
          uri: this.getGraphUrl() + options.path,
          qs: qs,
          method: method
        };

  // default to page access token
  if (!qs.access_token) {
    request_options.qs.access_token = this.getPageToken();  
  }
  
  if (!options.path) {
    console.error('No endpoint specified on Messenger send!');
    return;
  }

  if (method === 'POST') {
    if (!options.payload || typeof options.payload !== 'object') {
      console.error('Invalid request payload');
      return; 
    }

    request_options.json = options.payload;  
  }
  
  promise = new Promise((resolve, reject) => {
    request(request_options, (error, response, body) => {
      if (callback) {
        callback(error, response, body);
        return;  
      }

      if (error) {
        reject(error, body);
      }

      resolve(body);
    });
  })    
  return promise;
};

module.exports = GraphRequest;