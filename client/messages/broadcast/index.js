function Broadcast (GraphRequest) {
  this.sendBroadcast = sendBroadcast;
  this.startBroadcastReachEstimation = startBroadcastReachEstimation;
  this.getBroadcastReachEstimation = getBroadcastReachEstimation;
  this.callBroadcastApi = callBroadcastApi.bind(GraphRequest);
}

function sendBroadcast (message_creative_id, custom_label_id) {
  return new Promise (async (resolve, reject) => {
    if (!message_creative_id) {
      reject('Valid message_creative_id required');      
    }

    let options = {
      'message_creative_id': message_creative_id
    };    

    if (custom_label_id) options.custom_label_id = custom_label_id;
    
    try {
      let response = await this.callBroadcastApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }    
  });
}

function startBroadcastReachEstimation (label_id) {
  return new Promise (async (resolve, reject) => {
    let options = {
      'custom_label_id': label_id || true
    }    
    try {
      let response = await this.callBroadcastApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getBroadcastReachEstimation (reach_estimation_id) {
  return new Promise (async (resolve, reject) => {
    if (!reach_estimation_id) {
      reject('Valid reach_estimation_id required');
      
    }
    let options = {
      'reach_estimation_id': reach_estimation_id
    }
    try {
      let response = await this.callBroadcastApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

async function callBroadcastApi (options) {
  return new Promise (async (resolve, reject) => {
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

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = Broadcast;