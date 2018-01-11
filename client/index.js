const GraphRequest = require('./graph-api'),
      Messages = require('./messages'),
      MessengerProfile = require('./messenger-profile'),
      Person = require('./person'),
      MessengerCode = require('./messenger-codes'),
      MessagingInsights = require('./messaging-insights'),
      Attachment = require('./attachment-upload');      

/**
 * @constructor
 * @class Class for making Messenger Platform API requests
 * @type {Client}
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

  // /**
  //  * Sets a new page token to use for all Page-level requests
  //  * @instance
  //  * @param {string} page_token The new page token
  //  * @return {string} Updated page token
  //  */
  // this.setPageToken = GraphRequest.setPageToken;

  // /**
  //  * Gets the current page token being used for page-level requests
  //  * @instance
  //  * @return {string} Current page token
  //  */
  // this.getPageToken = GraphRequest.getPageToken;

  // /**
  //  * Sets a new app token to use for all app-level requests
  //  * @instance
  //  * @param {string} app_token The new app token
  //  * @return {string} Updated app token
  //  */
  // this.setAppToken = GraphRequest.setAppToken;

  // /**
  //  * Gets the current app token being used for app-level requests
  //  * @instance
  //  * @return {string} Current app token
  //  */
  // this.getAppToken = GraphRequest.getAppToken;

  // /**
  //  * Sets a new Graph API version to use for all requests
  //  * @instance
  //  * @param {string} version The new version in the format `v2.11`
  //  * @return {string} Updated version number
  //  */
  // this.setApiVersion = GraphRequest.setApiVersion;

  // /**
  //  * Gets the current Graph API version being used for all requests
  //  * @instance
  //  * @return {string} Current Graph API version
  //  */
  // this.getApiVersion = GraphRequest.getApiVersion;

}

module.exports = Client;