function CustomLabels (GraphRequest) {
  this.createCustomLabel = createCustomLabel;
  this.getCustomLabelById = getCustomLabelById;
  this.getCustomLabelsByPsid = getCustomLabelsByPsid;
  this.getAllCustomLabels = getAllCustomLabels;
  this.deleteCustomLabel = deleteCustomLabel;
  this.addPsidtoCustomLabel = addPsidtoCustomLabel;
  this.removePsidfromCustomLabel = removePsidfromCustomLabel;
  this.callCustomLabelsApi = callCustomLabelsApi.bind(GraphRequest);
}

/**
 * Creates a new custom label.
 * @param  {String}  name  The name of the custom label.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * Client.createCustomLabel('my_custom_label')
 *   .then(res => {
 *     console.log(res); // {"id": "9485676932424"}
 *   });
 */
function createCustomLabel (name) {
  return new Promise (async (resolve, reject) => {
    if (!name) {
      reject('name required');
    }
    let options = {
      'payload': {'name': name}
    };
    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Retrieves the id and name of a custom label.
 * @param  {Integer}  label_id  The ID of a custom label. Created with {@link #createcustomlabel|createCustomLabel()}.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let custom_label_id = 9485676932424,
 *     field = ['name', 'id']; //optional
 * Client.getCustomLabelById(custom_label_id, fields)
 *   .then(res => {
 *     console.log(res); // {"name": "my_custom_label", "id": "9485676932424"}
 *   });
 */
function getCustomLabelById (label_id) {
  return new Promise (async (resolve, reject) => {
    if (!label_id) {
      reject('label_id required');
    }
    let options = {
      'path': '/' + label_id,
      'qs': {'fields': 'id,name'}
    };

    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Retrieves the list of custom labels associated with a PSID.
 * @param  {Integer}  psid  The PSID of the user to retrieve the custom labels for.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * Client.getCustomLabelsByPsid(950724069735075)
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //   "data": [
 *     //     { "name": "myLabel", "id": "1001200005003"},
 *     //     { "name": "myOtherLabel", "id": "1001200005002"}
 *     //   ],
 *     //   "paging": {
 *     //     "cursors": {
 *     //       "before": "QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpyc",
 *     //       "after": "QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaU"
 *     //     }
 *     //   }
 *     // }
 *   });
 * 
 */
function getCustomLabelsByPsid (psid) {
  return new Promise (async (resolve, reject) => {
    if (!psid) {
      reject('PSID required');
    }

    let options = {
      'path': `/${psid}/custom_labels`
    };

    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Retrieves the list of all custom labels.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let field = ['name', 'id']; //optional
 * Client.getAllCustomLabels(fields)
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //   "data": [
 *     //     { "name": "myLabel", "id": "1001200005003"},
 *     //     { "name": "myOtherLabel", "id": "1001200005002"}
 *     //   ],
 *     //   "paging": {
 *     //     "cursors": {
 *     //       "before": "QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpyc",
 *     //       "after": "QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaU"
 *     //     }
 *     //   }
 *     // }
 *   });
 */
function getAllCustomLabels () {
  return new Promise (async (resolve, reject) => {
    let options = {
      'qs': {'fields': 'id,name'}
    };
    
    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Deletes a custom label.
 * @param  {Integer}  label_id  The ID of the custom label to delete.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * Client.deleteCustomLabel(094730967209673)
 *   .then(res => {
 *     console.log(res); // {"success": true}
 *   });
 */
function deleteCustomLabel (label_id) {
  return new Promise (async (resolve, reject) => {
    if (!label_id) {
      reject('label_id required');
      return;
    }
    let options = {
      'method': 'DELETE',
      'path': '/' + label_id
    };

    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Associates a user's PSID to a custom label.
 * @param  {Integer}  psid  PSID of the user to associate with the custom label.
 * @param  {Integer}  label_id  The ID of a custom label. Created with {@link #createcustomlabel|createCustomLabel()}.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let psid = 49670354734069743,
 *     custom_label_id = 0957209720496743; 
 * Client.addPsidtoCustomLabel(psid, custom_label_id)
 *   .then(res => {
 *     console.log(res); // {"success": true}
 *   });
 */
function addPsidtoCustomLabel (psid, label_id) {
  return new Promise (async (resolve, reject) => {
    if (!psid || !label_id) {
      reject('PSID and label_id required');
      return;
    }
    let options = {
      'path': `/${label_id}/label`,
      'payload': {'user': psid}
    };
    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Removes a user PSID from a custom label.
 * @param  {Integer}  psid  PSID of the user to remove from the custom label.
 * @param  {Integer}  label_id  The ID of a custom label.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let psid = 49670354734069743,
 *     custom_label_id = 0957209720496743; 
 * Client.removePsidfromCustomLabel(psid, custom_label_id)
 *   .then(res => {
 *     console.log(res); // {"success": true}
 *   });
 */
function removePsidfromCustomLabel (psid, label_id) {
  return new Promise (async (resolve, reject) => {
    if (!psid || !label_id) {
      reject('PSID and label_id required');
    }
    let options = {
      'method': 'DELETE',
      'path': `/${label_id}/label`,
      'payload': {'user': psid}
    };
    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function callCustomLabelsApi (options) {
  options.api_version = 'v2.11';
  
  if (!options.path) {
    options.path = '/me/custom_labels';
  }
  
  return this.sendGraphRequest(options);        
}

module.exports = CustomLabels;