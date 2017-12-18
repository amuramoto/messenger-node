'use strict';
const webhook = require('./webhook');

module.exports = messenger;

function messenger() {
  this.Webhook = webhook;
}
