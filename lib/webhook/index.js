const express = require('express'),
      body_parser = require('body-parser'),      
      util = require('./util');

/**
 * Creates and starts a webhook that emits all received webhook events.
 * @constructor
 * @class Webhook
 * @param {Object} options  Configuration options for your webhook. All options may also be set as environment variables.
 * @param {string} options.verify_token  May also be set as `MESSENGER_VERIFY_TOKEN` in environment variables.
 * @param {string} options.endpoint  _Optional._ Defaults to `/webhook`. May also be set as `MESSENGER_APP_ENDPOINT` in environment variables.
 * @param {string} options.app_secret  _Optional._ Your app secret. Required for `validateSignedRequest()`. May also be set as `MESSENGER_APP_SECRET` in environment variables.
 * @param {string} options.port    _Optional._ Defaults to `1337`. May also be set as `MESSENGER_PORT` in environment variables.
 * @returns {Webhook}
 * @example
 * const Messenger = require('messenger-node');
 *
 * // you can also set these as env vars
 * let options = {
 *   'verify_token': 'my_voice_is_my_passport',
 *   'app_secret': 'ih908wh084ggh423940hg934g358h0358hg3', //optional
 *   'endpoint': '/awesomewebhook' //optional
 *   'port': '9485' //optional
 * }
 * const Webhook = new Messenger.Webhook(options);
 */
function Webhook (options) {
  let app,
      server,
      port = options.port || process.env.PORT || 1337,
      endpoint = options.endpoint || process.env.MESSENGER_ENDPOINT || '/webhook',
      app_secret = options.app_secret || process.env.MESSENGER_APP_SECRET,
      verify_token = options.verify_token || process.env.MESSENGER_VERIFY_TOKEN;
  
  if (!verify_token) throw 'VERIFY_TOKEN required to create webhook!';
  if (endpoint.indexOf('/') !== 0) endpoint = '/' + endpoint;

  app = express().use(body_parser.json());  
  addWebhookEndpoint(endpoint, app);
  addVerifyEndpoint(verify_token, endpoint, app);
  
  server = app.listen(port, () => {    
    console.log('webhook is listening on port ' + port);
  });

  /**
   * Adds an event listener. Implements Node.js EventEmitter's [`emitter.on`](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener).
   * @param {String} event_name  The name of the event to listen for.
   * @param {Function} callback  The callback to execute when the event is received.
   * @function on
   * @memberof  Webhook
   * @example
   * Webhook.on('messaging_postbacks', (event_type, sender_info, webhook_event) => {
   *   // do something 
   * });   
   */
  this.on = app.on.bind(app);
  
  /**
   * Adds a one-time event listener that will be removed after it is called once. Implements Node.js EventEmitter's [`emitter.once`](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener).
   * @param {String} event_name  The name of the event to listen for.
   * @param {Function} callback  The callback to execute when the event is received.
   * @function once
   * @memberof  Webhook
   * @example
   * Webhook.once('messaging_postbacks', (event_type, sender_info, webhook_event) => {
   *   // do something 
   * });   
   */
  this.once = app.once.bind(app);

  /**
   * Emits an event from the Webhook instance. Event listeners can be set with `Webhook.on()` and `Webhook.once()`. Implements Node.js EventEmitter's [`emitter.once`](https://nodejs.org/api/events.html#events_emitter_emit_eventname_args).
   * @param {Object} eventName The name of the event to emit.
   * @returns {Object} ...args  _Optional._ Arguments to pass to the event listener.
   * @function emit
   * @memberof  Webhook
   * @example
   * Webhook.emit('my_event', arg1, arg2);   
   */
  this.emit = app.emit;

  /**
   * Retrieves the current Webhook instance. This is the express.js [`app`](http://expressjs.com/en/4x/api.html#app) instance.
   * @returns {Object} The Webhook instance.
   * @function getInstance
   * @memberof  Webhook
   * @example
   * let instance = Webhook.getInstance();
   * console.log(instance) // express.js app instance
   */
  this.getInstance = () => { return app; };

  /**
   * Stops the Webhook instance.
   * @param {Function} callback  A callback function to execute when the webhook is stopped.   
   * @function stopInstance
   * @memberof  Webhook
   * @example
   * Webhook.stopInstance(() => console.log('Webhook is stopped'));
   */
  this.stopInstance = (callback) => server.close(callback);

  /**
   * Retrieves the port the webhook is running on.
   * @returns {String} The current port number.
   * @function getPort
   * @memberof  Webhook
   * @example
   * let port = Webhook.getPort();
   * console.log(port) // '1337'
   */
  this.getPort = () => { return port; };

  /**
   * Retrieves the current endpoint of the webhook.
   * @returns {String} The current endpoint.
   * @function getEndpoint
   * @memberof  Webhook
   * @example
   * let endpoint = Webhook.getEndpoint();
   * console.log(endpoint) // '/webhook'
   */
  this.getEndpoint = () => { return endpoint; };

  /**
   * Retrieves the current verify token of the webhook.
   * @returns {String} The current verify token.
   * @function getVerifyToken
   * @memberof  Webhook
   * @example
   * let verifyToken = Webhook.getVerifyToken();
   * console.log(verifyToken) // 'my_verify_token'
   */
  this.getVerifyToken = () => { return verify_token; };

  /**
   * Sets the app secret used for validating signed requests.
   * @param {String} app_secret The app secret to set.
   * @returns {String} The app secret that was successfully set.
   * @function setAppSecret
   * @memberof  Webhook
   * @example
   * let app_secret = Webhook.setAppSecret('hgr0a8h30gh30agh');
   * console.log(app_secret) // 'hgr0a8h30gh30agh'
   */
  this.setAppSecret = (secret) => { 
    app_secret = secret;
    return app_secret;
  };
  
  /**
   * Verifies a signed request received by calling [`getcontext()`](https://developers.facebook.com/docs/messenger-platform/webview/context) in the Messenger webview.
   * @param {Object} signed_request  The signed request.
   * @returns {Object} The decrypted signed request.
   * @function  validateSignedRequest
   * @memberof  Webhook
   * @example
   * let request = {
   *   'tid': '1254453049382119',
   *   'thread_type': 'USER_TO_PAGE', 
   *   'psid': '1254413049321919',
   *   'signed_request': 'QDTuYBidQ7pbpxIbPwgsb__nHty2...'
   * };   
   * let decrypted_request = Webhook.validateSignedRequest(signed_request);
   * 
   * console.log(decrypted_request)
   * // {
   * //   "psid": "1254413049321919", 
   * //   "algorithm": "HMAC-SHA256", 
   * //   "thread_type": "GROUP", 
   * //   "tid": "1254453049382119", 
   * //   "issued_at": 1491351619, 
   * //   "page_id": 239483560376726
   * // }
   */
  this.validateSignedRequest = (signed_request) => {
    if (!app_secret) {
      let error_message = 'Cannot validate signed request: app_secret not set';
      console.error(error_message);
      return {error_message};
    }
    return util.validateSignedRequest(app_secret, signed_request);
  };
}

function addVerifyEndpoint (verify_token, endpoint, app) {
  app.get(endpoint, (req, res) => {
    // Parse params from the verification request
    let verification = util.verifyWebhook(verify_token, req.query);
    if (!verification) {
      res.sendStatus(403);
    }
    res.status(200).send(req.query['hub.challenge']);
  });

  return;
}

function addWebhookEndpoint (endpoint, app) {
  
  app.post(endpoint, (req, res) => {  
    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page' && body.entry) {

      body.entry.forEach(entry => {
        let webhook_event = entry.messaging[0];        
        let sender_id = util.parseSenderId(webhook_event.sender);
        let event_type = util.parseEventType(webhook_event);
        app.emit(event_type.type, event_type, sender_id, webhook_event);
      });

      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
      
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  });

  return;
}

module.exports = Webhook;