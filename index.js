'use strict';
const webhook = require('./webhook/webhook');

module.exports = messenger;

function messenger() {
  this.create = webhook.createWebhook;
  this.events = webhook.emitter;
  this.getInstance = webhook.getWebhookInstance;
}
