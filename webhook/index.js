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
 */
function Webhook (options) {
  let app,
    server,
    port = options.port || process.env.MESSENGER_PORT || 1337,
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
   */
  this.on = app.on.bind(app);
  
  /**
   * Adds a one-time event listener that will be removed after it is called once. Implements Node.js EventEmitter's [`emitter.once`](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener).
   * @param {String} event_name  The name of the event to listen for.
   * @param {Function} callback  The callback to execute when the event is received.
   * @function once
   * @memberof  Webhook
   */
  this.once = app.once.bind(app);

  /**
   * Emits an event from the Webhook instance. Event listeners can be set with `Webhook.on()` and `Webhook.once()`. Implements Node.js EventEmitter's [`emitter.once`](https://nodejs.org/api/events.html#events_emitter_emit_eventname_args).
   * @param {Object} eventName The name of the event to emit.
   * @returns {Object} ...args  _Optional._ Arguments to pass to the event listener.
   * @function emit
   * @memberof  Webhook
   */
  this.emit = app.emit;

  /**
   * Retrieves the current Webhook instance. This is the express.js [`app`](http://expressjs.com/en/4x/api.html#app) instance.
   * @returns {Object} The Webhook instance.
   * @function getInstance
   * @memberof  Webhook
   */
  this.getInstance = () => { return app; };

  /**
   * Stops the Webhook instance.
   * @param {Function} callback  A callback function to execute when the webhook is stopped.   
   * @function stopInstance
   * @memberof  Webhook
   */
  this.stopInstance = (callback) => server.close(callback);

  /**
   * Retrieves the port the webhook is running on.
   * @returns {String} The current port number.
   * @function getPort
   * @memberof  Webhook
   */
  this.getPort = () => { return port; };

  /**
   * Retrieves the current endpoint of the webhook.
   * @returns {String} The current endpoint.
   * @function getEndpoint
   * @memberof  Webhook
   */
  this.getEndpoint = () => { return endpoint; };

  /**
   * Retrieves the current verify token of the webhook.
   * @returns {String} The current verify token.
   * @function getVerifyToken
   * @memberof  Webhook
   */
  this.getVerifyToken = () => { return verify_token; };

  /**
   * Sets the app secret used for validating signed requests.
   * @param {String} app_secret The app secret to set.
   * @returns {String} The app secret that was successfully set.
   * @function setAppSecret
   * @memberof  Webhook
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
   */
  this.validateSignedRequest = (signed_request) => {
    if (!app_secret) {
      console.error('Cannot validate signed request: app_secret not set');
      return;
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