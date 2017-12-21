const request = require('request');

function send (path, payload, callback) {

  let promise;
  const method = payload ? 'POST' : 'GET',
        request_options = {
          uri: this.graph_url + path,
          qs: {'access_token': this.page_token},
          method: method
        };

  if (!path) {
    console.error('No endpoint specified on Messenger send!');
    return;
  }

  if (!payload || typeof payload !== 'object') {
    console.error('Invalid request payload');
    return; 
  }

  request_options.json = payload;

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