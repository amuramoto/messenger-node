const request = require('request');

function send (options, callback) {

  let promise;
  let qs = options.qs || {};
  const method = options.payload ? 'POST' : 'GET',
        request_options = {
          uri: this.graph_url + options.path,
          qs: qs,
          method: method
        };

  request_options.qs.access_token = this.page_token;

  if (!options.path) {
    console.error('No endpoint specified on Messenger send!');
    return;
  }

  if (!options.payload || typeof options.payload !== 'object') {
    console.error('Invalid request payload');
    return; 
  }

  request_options.json = options.payload;

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

module.exports = {
  send
}