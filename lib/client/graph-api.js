const request = require('request'),
      fs = require('fs');

function GraphRequest(options) {  

  if (!options.page_token) {
    console.error('PAGE TOKEN REQUIRED!');
    return;
  }

  var page_token = options.page_token,
    app_token = options.app_token,
    graph_api_version = options.graph_api_version || process.env.GRAPH_API_VERSION || '';
  
  /**
   * Sets a new page token to use for all Page-level requests   
   * @param {string} page_token The new page token
   * @return {string} Updated page token
   * @memberof Client#
   * @example
   * Client.setPageToken('sgh084th3t3ht340t34h8t3t940390th34')
   *  .then(res => {
   *     console.log(res) // 'sgh084th3t3ht340t34h8t3t940390th34'
   *  });
   */
  this.setPageToken = token => {
    page_token = token;
    return page_token;
  };

  /**
   * Gets the current page token being used for page-level requests
   * @return {string} Current page token
   * @memberof Client#
   * @example
   * Client.getPageToken()
   *  .then(res => {
   *     console.log(res) // 'sgh084th3t3ht340t34h8t3t940390th34'
   *  });
   */
  this.getPageToken = () => {return page_token;};

  /**
   * Sets a new app token to use for all app-level requests
   * @param {string} app_token The new app token
   * @return {string} Updated app token
   * @memberof Client#
   * @example
   * Client.setAppToken('9h03t9h0ahtg409thw3t34h8t3t940390th34')
   *  .then(res => {
   *     console.log(res) // '9h03t9h0ahtg409thw3t34h8t3t940390th34'
   *  });
   */
  this.setAppToken = token => {
    app_token = token;
    return app_token;
  };

  /**
   * Gets the current app token being used for app-level requests
   * @return {string} Current app token
   * @memberof Client#
   * @example
   * Client.getAppToken()
   *  .then(res => {
   *     console.log(res) // '9h03t9h0ahtg409thw3t34h8t3t940390th34'
   *  });
   */
  this.getAppToken = () => {return app_token;};

  /**
   * Sets a new Graph API version to use for all requests
   * @param {string} version The new version in the format `v2.11`
   * @return {string} Updated version number
   * @memberof Client#
   * @example
   * Client.setApiVersion('v2.6')
   *  .then(res => {
   *     console.log(res) // 'v2.6'
   *  });
   */
  this.setApiVersion = version => {
    graph_api_version = formatApiVersion(version);
    return graph_api_version;
  };

  /**
   * Gets the current Graph API version being used for all requests
   * @return {string} Current Graph API version
   * @memberof Client#
   * @example
   * Client.getApiVersion()
   *  .then(res => {
   *     console.log(res) // 'v2.6'
   *  });
   */
  this.getApiVersion = () => {
    return graph_api_version;
  };

  this.sendGraphRequest = sendGraphRequest;
}

function formatApiVersion (version) {
  let graph_api_version;

  if (!version) { return; }

  if (typeof version !== 'string' || version.indexOf('v') !== 0) {
    graph_api_version = 'v' + version;
  }
  return graph_api_version;
}

function sendGraphRequest (options) {

  const api_version = options.api_version || this.getApiVersion(),
        qs = options.qs || {},
        request_options = {
          uri: 'https://graph.facebook.com',
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
      
      for (data in options.formData) {
        if (typeof options.formData[data] !== 'string') {
          options.formData[data] = JSON.stringify(options.formData[data]);  
        }        
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
  });    
}

module.exports = GraphRequest;