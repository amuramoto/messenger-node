const GraphRequest = require('./graph-api'),
      Messages = require('./messages'),
      MessengerProfile = require('./messenger-profile'),
      Person = require('./person'),
      MessengerCode = require('./messenger-codes'),
      MessagingInsights = require('./messaging-insights'),
      Attachment = require('./attachment-upload');      

/**
 * @constructor
 * @class Client
 * @param {Object} options  
 * @param {string} options.page_token
 * @param {string} options.app_token
 * @param {string} options.graph_api_version
 * @returns {Client}
 */
function Client (options) {
  
  let graphRequest = new GraphRequest(options);
  let messages = new Messages(graphRequest);
  let messengerProfile = new MessengerProfile(graphRequest);
  let person = new Person(graphRequest);
  let messengerCode = new MessengerCode(graphRequest);
  let messagingInsights = new MessagingInsights(graphRequest);
  let attachment = new Attachment(graphRequest);  

  Object.assign(this, messages, messengerProfile, person, messengerCode, messagingInsights, attachment, graphRequest);
}

module.exports = Client;