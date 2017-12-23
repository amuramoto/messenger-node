const send_api = require('./send-api'),
      GraphRequest = require('./graph-api'),
      messenger_profile_api = require('./messenger-profile-api');

function Client (options) {
  

  let Graph = new GraphRequest(options);
  Object.assign(this, Graph, send_api, messenger_profile_api);

}

module.exports = Client;