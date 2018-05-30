function HandoverProtocol (GraphRequest) {
  this.passThreadControl = passThreadControl.bind(GraphRequest);
  this.takeThreadControl = takeThreadControl.bind(GraphRequest);
  this.requestThreadControl = requestThreadControl.bind(GraphRequest);
  this.getThreadOwner = getThreadOwner.bind(GraphRequest);
  this.getSecondaryReceiverList = getSecondaryReceiverList.bind(GraphRequest);

}

/**
 * Initiates a new handover protocol [pass thread control](https://developers.facebook.com/docs/messenger-platform/handover-protocol/pass-thread-control) event.
 * @param  {Integer}  psid  The PSID of the user whose thread you want to initiate the pass thread control event for.
 * @param  {Integer}  target_app_id   _Optional._ The app ID of the app to pass thread control to. Set to `page_inbox` to pass thread control to the Page Inbox.
 * @param  {String}   metadata   _Optional._ An arbitrary string that will be delivered to the target app with the `messaging_handovers` webhook event.
 * @return {Promise}  The API response
 * @memberof  Client#
 * @example
 * let psid = 1008372609250235,
 *     target_app_id = 1719933432123212,
 *     metadata = 'I passed control to you'; // optional
 * Client.passThreadControl(psid, target_app_id, metadata)
 *   .then(res => {
 *     console.log(res); // {'success': true}
 *   });
 */
function passThreadControl (psid, target_app_id, metadata) {  
  return new Promise (async (resolve, reject) => {
    if (!target_app_id) {
      reject('target_app_id required');
    } else if (target_app_id === 'page_inbox') {
      target_app_id = 263902037430900;
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

/**
 * Initiates a new handover protocol [take thread control](https://developers.facebook.com/docs/messenger-platform/handover-protocol/take-thread-control) event.
 * This may only be called by the app with the Primary Receiver app role.
 * @param  {Integer}  psid  The PSID of the user whose thread you want to initiate the take thread control event for.
 * @param  {String}   metadata   _Optional._ An arbitrary string that will be delivered to the Secondary Receiver app with the `messaging_handovers` webhook event.
 * @return {Promise}  The API response
 * @memberof  Client#
 * @example
 * let psid = 1008372609250235,
 *     metadata = 'I'm taking control from you'; // optional
 * Client.takeThreadControl(psid, metadata)
 *   .then(res => {
 *     console.log(res); // {'success': true}
 *   });
 */
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

/**
 * Initiates a new handover protocol [request thread control](https://developers.facebook.com/docs/messenger-platform/handover-protocol/request-thread-control) event.
 * @param  {Integer}  psid  The PSID of the user whose thread you want to initiate the request thread control event for.
 * @param  {String}   metadata   _Optional._ An arbitrary string that will be delivered to the Primary Receiver app with the `messaging_handovers` webhook event.
 * @return {Promise}  The API response
 * @memberof  Client#
 * @example
 * let psid = 1008372609250235,
 *     metadata = 'I'm requesting control from you'; // optional
 * Client.requestThreadControl(psid, metadata)
 *   .then(res => {
 *     console.log(res); // {'success': true}
 *   });
 */
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

/**
 * Retrieves the app ID of the current [thread owner](https://developers.facebook.com/docs/messenger-platform/handover-protocol/take-thread-control).
 * @param  {Integer}  psid  The PSID of the user whose thread you want to get the thread owner of.
 * @param  {String}   metadata   _Optional._ An arbitrary string that will be delivered to the target app with the `messaging_handovers` webhook event.
 * @return {Promise}  The API response
 * @memberof  Client#
 * @example
 * let psid = 1008372609250235
 * Client.getThreadOwner(psid)
 *   .then(res => {
 *     console.log(res); 
 *     // {
 *     //   "data": [{
 *     //     "thread_owner": {
 *     //       "app_id": "1719933678308212"
 *     //     }
 *     //   }]
 *     // }
 *   });
 */
function getThreadOwner (psid) {  
  return new Promise (async (resolve, reject) => {    
    if (!psid) {
      reject('PSID required to identify the thread to get owner for');
    }
    
    try {
      let request_options = {
        'path': '/me/thread_owner',
        'qs': {'recipient': psid}
      };

      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Retrieves a list of app ID's of all [Secondary Receivers](https://developers.facebook.com/docs/messenger-platform/handover-protocol#secondary_receivers_list) for the Page.
 * @param  {Integer}  psid  The PSID of the user whose thread you want to get the list of Secondary Receiver apps for.
 * @return {Promise}  The API response
 * @memberof  Client#
 * @example
 * let psid = 1008372609250235
 * Client.getThreadOwner(psid)
 *   .then(res => {
 *     console.log(res); 
 *     // {
 *     //   "data": [
 *     //     {
 *     //       "id": "12345678910",
 *     //       "name": "David's Composer"
 *     //     },
 *     //     {
 *     //       "id": "23456789101",
 *     //       "name": "Messenger Rocks"
 *     //     }
 *     //   ]
 *     // }
 *   });
 */
function getSecondaryReceiverList (psid) {  
  return new Promise (async (resolve, reject) => {    
    if (!psid) {
      reject('PSID required to identify the thread to get owner for');
    }
    
    try {
      let request_options = {
        'path': '/me/secondary_receivers',
        'qs': {
          'fields': 'id, name'
        }
      };

      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = HandoverProtocol;