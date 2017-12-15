'use strict';
const webhook = require('./webhook/webhook');

module.exports = messenger;

function messenger() {
  this.webhook = {
    create: webhook.createWebhook,
    events: webhook.emitter,
    getInstance: webhook.getWebhookInstance
  }
}
