const request = require('request'),
      fs = require('fs');

function GraphRequest(options) {  

  if (!options.page_token) {
    console.error('PAGE TOKEN REQUIRED!');
    return
  }

  var page_token = options.page_token,
      app_token = options.app_token,
      graph_url = 'https://graph.facebook.com',
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
    return formatApiVersion(version);
  }

  this.getApiVersion = version => {
    return graph_api_version;
  }

  if (this.graph_api_version) {
    this.setApiVersion(this.graph_api_version);
  }

  this.sendGraphRequest = sendGraphRequest;
}

function formatApiVersion (version) {
  let graph_api_version;
  if (typeof version !== 'string' || version.indexOf('v') !== 0) {
    graph_api_version = 'v' + version;
  }
  return graph_api_version;
}

function sendGraphRequest (options, callback) {

  let promise;
  const graph_url = this.getGraphUrl(),
        api_version = options.api_version || this.getApiVersion(),
        qs = options.qs || {},
        request_options = {
          uri: graph_url,
          qs: qs,
          method: options.method || 'GET'
        };

  if (!options.path) {
    console.error('Valid "path" property required');
    return;
  }

  // default to page access token
  if (!qs.access_token) {
    request_options.qs.access_token = this.getPageToken();  
  }

  // override default version set on GraphRequest
  if (api_version) {    
    request_options.uri += `/${api_version}`; 
  }

  request_options.uri += `${options.path}`;

  if (options.payload || options.formData) request_options.method = 'POST';    

  if (options.payload) {
    if (typeof options.payload !== 'object') {
      console.error('Invalid request payload');
      return; 
    }
    request_options.json = options.payload;
  }

  if (options.formData) {
    if (typeof options.formData !== 'object') {
      console.error('Invalid formData');
      return;
    }
    options.formData.filedata = fs.createReadStream(options.formData.filedata);       
    request_options.formData = options.formData;
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