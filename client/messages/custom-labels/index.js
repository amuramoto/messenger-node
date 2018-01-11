function CustomLabels (GraphRequest) {
  this.createCustomLabel = createCustomLabel;
  this.getCustomLabelById = getCustomLabelById;
  this.getCustomLabelsByPsid = getCustomLabelsByPsid;
  this.getAllCustomLabels = getAllCustomLabels;
  this.deleteCustomLabel = deleteCustomLabel;
  this.addPsidtoCustomLabel = addPsidtoCustomLabel;
  this.removePsidfromCustomLabel = removePsidfromCustomLabel;
  this.callCustomLabelsApi = callCustomLabelsApi.bind(GraphRequest);
};

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

function getCustomLabelById (label_id, fields) {
  return new Promise (async (resolve, reject) => {
    if (!label_id) {
      reject('label_id required');
    }
    let options = {
      'path': '/' + label_id    
    }

    if (fields) {
      fields = fields.join(',');
      options.qs = {'fields': fields};
    }
    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getCustomLabelsByPsid (psid) {
  return new Promise (async (resolve, reject) => {
    if (!psid) {
      reject('PSID required');
    }

    let options = {
      'path': `/${psid}/custom_labels`
    }

    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getAllCustomLabels (fields) {
  return new Promise (async (resolve, reject) => {
    let options = {};
    if (fields) {
      fields = fields.join(',');
      options = {
        'qs': {'fields': fields}
      }
    }
    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteCustomLabel (label_id) {
  return new Promise (async (resolve, reject) => {
    if (!label_id) {
      reject('label_id required');
      return;
    }
    let options = {
      'method': 'DELETE',
      'path': '/' + label_id
    }

    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function addPsidtoCustomLabel (psid, label_id) {
  return new Promise (async (resolve, reject) => {
    if (!psid || !label_id) {
      reject('PSID and label_id required');
      return;
    }
    let options = {
      'path': `/${label_id}/label`,
      'payload': {'user': psid}
    }
    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function removePsidfromCustomLabel (psid, label_id) {
  return new Promise (async (resolve, reject) => {
    if (!psid || !label_id) {
      reject('PSID and label_id required');
    }
    let options = {
      'method': 'DELETE',
      'path': `/${label_id}/label`,
      'payload': {'user': psid}
    }
    try {
      let response = await  this.callCustomLabelsApi(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function callCustomLabelsApi (options) {
  return new Promise (async (resolve, reject) => {
    options.api_version = 'v2.11';
    
    if (!options.path) {
      options.path = '/me/custom_labels';
    }
    
    try {
      let response = await this.sendGraphRequest(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = CustomLabels