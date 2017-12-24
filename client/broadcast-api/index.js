const Message = require('../send-api');

function Broadcast (GraphRequest) {
  this.send = send.bind(GraphRequest);
  this.startReachEstimation = startReachEstimation;
  this.getReachEstimation = getReachEstimation;
  this.sendBroadcast = sendBroadcast;
  this.createMessageCreative = createMessageCreative;

}

function createMessageCreative (message) {
  if (!message) {
    console.error('Valid message object required');
    return;
  }
  let options = {'message': message};
  return this.sendGraphRequest(options);
}

/*TODO: VALIDATE MESSAGE PAYLOAD*/
function sendBroadcast (options) {
  if (!options.message_creative_id) {
    console.error('Valid message_creative_id propertu required');
    return;
  }
  return this.sendGraphRequest(options);
}

function startReachEstimation (label_id) {
  let options = {};
  if (label_id) {
    options = {
      'custom_label_id': label_id
    }
  }
  
  return this.sendGraphRequest(options);
}

function getReachEstimation (reach_estimation_id) {
  if (!reach_estimation_id) {
    console.error('Valid reach_estimation_id required');
    return;
  }
  let options = {
    'reach_estimation_id': reach_estimation_id
  }
  return this.sendGraphRequest(options);
}

function send (options) {
  let request_options = {};

  if (options.message_creative_id) {
    this.request_options.path = '/me/broadcast_messages';
  } else if (options.message) {
    this.request_options.path = '/me/message_creatives'
  } else if (options.custom_label_id) {
    this.request_options.path = '/me/broadcast_reach_estimations';
  } else if (options.reach_estimation_id) {
    this.request_options.path = `/${options.reach_estimation_id}`;
  }

  return this.sendGraphRequest(request_options);
}

module.exports = Broadcast;