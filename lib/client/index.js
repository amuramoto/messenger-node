const GraphRequest = require('./graph-api'),
      Messages = require('./messages'),
      MessengerProfile = require('./messenger-profile'),
      Person = require('./person'),
      MessengerCode = require('./messenger-codes'),
      MessagingInsights = require('./messaging-insights'),
      Attachment = require('./attachment-upload');      

/**
 * Creates an instance of `Client`, used for sending requests to the Messenger Platform APIs.
 * @constructor
 * @class Client
 * @param {Object} options  An object that contains the configuration settings for the `Client`.
 * @param {String} options.page_token  A valid Page-scoped access token.
 * @param {String} options.app_token  _Optional._ A valid app-scoped access token. Required for ID Matching.
 * @param {String} options.graph_api_version  _Optional._ The version of the Graph API to target for all API requests. Defaults to latest. Must be in the format `v2.11`.
 * @returns {Client}
 * @example
 * const Messenger = require('messenger-node');
 * let options = {
 *   'page_token': 'sd0we98h248n2g40gh4g80h32',
 *   'app_token': 'ih908wh084ggh423940hg934g358h0358hg3', //optional
 *   'api_version': 'v2.9' //optional
 * }
 * const Client = new Messenger.Client(options);
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