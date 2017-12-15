const request = require('request'),
      env = require('../env');

function send (path, payload, callback) {
  if (!path) {
    console.error('No endpoint specified on Messenger send!');
    return;
  }

  let accessToken = process.env.MESSENGER_PAGE_ACCESS_TOKEN || env.MESSENGER_PAGE_ACCESS_TOKEN;
  let graphUrl = process.env.GRAPH_URL;
  if (!accessToken || !graphUrl) {
    console.error('No Messenger page access token or graph url configured!');
    return;
  }

  const queryParams = {
    access_token: accessToken,
  };

  const method = payload ? 'POST' : 'GET';

  console.log(
    'Sending some post data: ',
    JSON.stringify(payload, null, 2)
  );

  request({
    uri: graphUrl + path,
    qs: queryParams,
    method: method,
    json: payload,
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Message sent succesfully: \n', JSON.stringify({
        endpoint: path,
        message_data: payload,
      }, null, 2));
      console.log('Received back the following body: \n', JSON.stringify(
        body, null, 2));
    } else {
      console.error(
        'Failure when calling Messenger API endpoint',
        response.statusCode,
        response.statusMessage,
        body.error
      );
    }
    callback(body);
  });
};

module.exports = {
  send,
};
