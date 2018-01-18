const Messenger = require('../../../index.js'),
      PAGE_TOKEN = process.env.TEST_PAGE_TOKEN,
      APP_TOKEN = process.env.TEST_APP_TOKEN;

function Client () {
  let options = {
    'page_token': PAGE_TOKEN,
    'app_token': APP_TOKEN,
    'graph_api_version': ''
  };
  return new Messenger.Client(options);  
}

module.exports = Client();