'use strict';

const express = require('express'),
      body_parser = require('body-parser'),      
      util = require('./util'),
      EventEmitter = require('events'),
      emitter = new EventEmitter();      

let app;      

module.exports = {
  createWebhook: createWebhook,
  emitter: emitter,
  getWebhookInstance: getWebhookInstance
}

function createWebhook (options) {
  // verify_token required
  if (!options.verify_token) throw 'VERIFY_TOKEN REQUIRED';
  app = express().use(body_parser.json());      
  util.addWebhookReceiver(emitter, app, options);
  util.addWebhookVerification(options.verify_token, app);
  app.listen(options.port || process.env.PORT, () => {
    console.log('webhook is listening')
  });
  return app;
}


function getWebhookInstance () {
  return app;
}