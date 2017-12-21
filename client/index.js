const request = require('request'),
      send_api = require('./send-api'),
      platform = require('./platform'),
      env = require('../env');

module.exports = Client;

function Client () {  
  Object.assign(this, platform, send_api);
}