function send (path, payload, callback) {
  let promise;
  const method = payload ? 'POST' : 'GET',
        access_token = process.env.MESSENGER_PAGE_ACCESS_TOKEN || env.MESSENGER_PAGE_ACCESS_TOKEN,
        graph_url = process.env.GRAPH_URL || env.GRAPH_URL || 'https://graph.facebook.com',
        request_options = {
          uri: graph_url + path,
          qs: {'access_token': access_token},
          method: method
        };

  if (!path) {
    console.error('No endpoint specified on Messenger send!');
    return;
  }

  if (!accessToken) {
    console.error('No Messenger Page access token configured!');
    return;
  }

  if (payload) request_options.json = payload;

  promise = new Promise((resolve, reject) => {
    request(request_options, (error, response, body) => {
      if (callback) {
        callback(body);
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