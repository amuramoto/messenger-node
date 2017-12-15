'use strict';
const webhook = require('./webhook/webhook');

module.exports = messenger;

function messenger() {
  this.Webhook = {
    create: webhook.createWebhook,
    events: webhook.emitter,
    getInstance: webhook.getWebhookInstance
  }
}
