function sendBroadcast (options) {
  if (!options.message_creative_id) {
    console.error('Valid message_creative_id required');
    return;
  }

  let request_options = options;
  
  return this.callBroadcastApi(request_options);
}

function startBroadcastReachEstimation (label_id) {
  let options = {
    'custom_label_id': label_id || true
  }
  
  return this.callBroadcastApi(options);
}

function getBroadcastReachEstimation (reach_estimation_id) {
  if (!reach_estimation_id) {
    console.error('Valid reach_estimation_id required');
    return;
  }
  let options = {
    'reach_estimation_id': reach_estimation_id
  }
  return this.callBroadcastApi(options);
}

function callBroadcastApi (options) {
  let request_options = {'api_version': 'v2.11'};

  if (options.message_creative_id) {
    request_options.path = '/me/broadcast_messages';
    request_options.payload = options;
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

module.exports = {
  sendBroadcast,
  startBroadcastReachEstimation,
  getBroadcastReachEstimation
};