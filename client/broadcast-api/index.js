const util = require('../send-api/util');

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
  return this.send(options);
}

function sendBroadcast (options) {
  if (!options.message_creative_id) {
    console.error('Valid message_creative_id propertu required');
    return;
  }
  console.log(options)
  return this.send(options);
}

function startReachEstimation (label_id) {
  let options = {
    'custom_label_id': label_id || true
  }
  
  return this.send(options);
}

function getReachEstimation (reach_estimation_id) {
  if (!reach_estimation_id) {
    console.error('Valid reach_estimation_id required');
    return;
  }
  let options = {
    'reach_estimation_id': reach_estimation_id
  }
  return this.send(options);
}

function send (options) {
  let request_options = {'api_version': 'v2.11'};

  if (options.message_creative_id) {
    request_options.path = '/me/broadcast_messages';
    request_options.payload = options;
  } else if (options.message) {    
    request_options.path = '/me/message_creatives'
    request_options.payload = {
      'messages': [util.parseMessageProps(options.message)]
    }    
  } else if (options.custom_label_id) {
    request_options.path = '/me/broadcast_reach_estimations';
    request_options.payload = {};
    if (typeof options.custom_label_id === 'string') {
      request_options.payload = options;        
    }
  } else if (options.reach_estimation_id) {
    request_options.path = `/${options.reach_estimation_id}`;
  }

  return this.sendGraphRequest(request_options);
}

module.exports = Broadcast;