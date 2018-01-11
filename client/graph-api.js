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
    return page_token;
  }

  this.getPageToken = () => {return page_token;}

  this.setAppToken = token => {
    app_token = token;
    return app_token;
  }

  this.getAppToken = () => {return app_token;}

  this.setApiVersion = version => {
    graph_api_version = formatApiVersion(version);
    return graph_api_version;
  }

  this.getApiVersion = version => {
    return graph_api_version;
  }

  if (this.graph_api_version) {
    this.setApiVersion(graph_api_version);
  }

  this.sendGraphRequest = sendGraphRequest;
}

function formatApiVersion (version) {
  let graph_api_version;

  if (!version) { return };

  if (typeof version !== 'string' || version.indexOf('v') !== 0) {
    graph_api_version = 'v' + version;
  }
  return graph_api_version;
}

function sendGraphRequest (options) {

  const graph_url = this.getGraphUrl(),
        api_version = options.api_version || this.getApiVersion(),
        qs = options.qs || {},
        request_options = {
          uri: graph_url,
          qs: qs
        };

  return new Promise((resolve, reject) => {
    if (!options.path) {
      reject ('Valid "path" property required');      
    }

    // default to page access token
    if (!qs.access_token) {
      request_options.qs.access_token = this.getPageToken();  
    }

    // override default version set on GraphRequest
    if (api_version) {    
      request_options.uri += `/${api_version}`; 
    }

    // set uri path
    request_options.uri += `${options.path}`;

    // set HTTP method
    if (options.method) {
      request_options.method = options.method;
    } else if (options.payload || options.formData) {
      request_options.method = 'POST';    
    } else {
      request_options.method = 'GET';
    }

    // add the request payload
    if (options.payload) {
      if (typeof options.payload !== 'object') {
        reject('Invalid request payload'); 
      }
      request_options.json = options.payload;
    }

    // handle form data
    if (options.formData) {
      if (typeof options.formData !== 'object') {
        reject('Invalid formData');
      }
      if (options.formData.filedata) {
        options.formData.filedata = fs.createReadStream(options.formData.filedata);       
      }
      request_options.formData = options.formData;
    }

    // make the request
    request(request_options, (error, response, body) => {      
      if (error) {
        reject(error, body);
      }

      if (body.error) {
        reject(body);
      }

      if (typeof body === 'string') body = JSON.parse(body);
      resolve(body);
    });
  })    
};

module.exports = GraphRequest;