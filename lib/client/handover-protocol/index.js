function HandoverProtocol (GraphRequest) {
  this.passThreadControl = passThreadControl.bind(GraphRequest);
  this.takeThreadControl = takeThreadControl.bind(GraphRequest);
  this.requestThreadControl = requestThreadControl.bind(GraphRequest);
  this.getThreadOwner = getThreadOwner.bind(GraphRequest);
  this.getSecondaryReceiverList = getSecondaryReceiverList.bind(GraphRequest);

}

function passThreadControl (psid, target_app_id, metadata) {  
  return new Promise (async (resolve, reject) => {
    if (!target_app_id) {
      reject('target_app_id required');
    }

    if (!psid) {
      reject('PSID required to identify the thread to enact handover for');
    }
    
    let payload = {
      'recipient': {
        'id': psid
      },
      'target_app_id': target_app_id
    };

    if (metadata) {
      payload.metadata = metadata
    }

    try {
      let request_options = {
        'path': '/me/pass_thread_control',
        'payload': payload
      };

      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function takeThreadControl (psid, metadata) {  
  return new Promise (async (resolve, reject) => {
    if (!psid) {
      reject('PSID required to identify the thread to enact handover for');
    }
    
    let payload = {
      'recipient': {
        'id': psid
      }
    };

    if (metadata) {
      payload.metadata = metadata
    }

    try {
      let request_options = {
        'path': '/me/take_thread_control',
        'payload': payload
      };

      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function requestThreadControl (psid, metadata) {  
  return new Promise (async (resolve, reject) => {    
    if (!psid) {
      reject('PSID required to identify the thread to enact handover for');
    }
    
    let payload = {
      'recipient': {
        'id': psid
      }
    };

    if (metadata) {
      payload.metadata = metadata
    }

    try {
      let request_options = {
        'path': '/me/request_thread_control',
        'payload': payload
      };

      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getThreadOwner (psid) {  
  return new Promise (async (resolve, reject) => {    
    if (!psid) {
      reject('PSID required to identify the thread to get owner for');
    }
    
    try {
      let request_options = {
        'path': '/me/pass_thread_control',
        'qs': `recipient={psid}`
      };

      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getSecondaryReceiverList (psid) {  

}

module.exports = HandoverProtocol;