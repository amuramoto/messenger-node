function createCustomLabel (name) {
  if (!name) {
    console.error('name required');
    return;
  }
  let options = {
    'payload': {'name': name}
  };
  return this.callCustomLabelsApi(options);
}

function getCustomLabel (label_id, fields) {
  if (!label_id) {
    console.error('label_id required');
    return;
  }
  let options = {
    'path': label_id    
  }

  if (fields) {
    fields = fields.join(',');
    options.qs = {'fields': fields};
  }
  return this.callCustomLabelsApi(options);
}

function getCustomLabelsByPsid (psid) {
  if (!psid) {
    console.error('PSID required');
    return;
  }

  let options = {
    'path': `${psid}/custom_labels`
  }

  return this.callCustomLabelsApi(options);
}

function getAllCustomLabels (fields) {
  let options = {};
  if (fields) {
    fields = fields.join(',');
    options = {
      'qs': {'fields': fields}
    }
  }
  return this.callCustomLabelsApi(options);
}

function deleteCustomLabel (label_id) {
  if (!label_id) {
    console.error('label_id required');
    return;
  }
  let options = {
    'method': 'DELETE',
    'path': label_id
  }

  return this.callCustomLabelsApi(options);
}

function addPsidtoCustomLabel (psid, label_id) {
  if (!psid || !label_id) {
    console.error('PSID and label_id required');
    return;
  }
  let options = {
    'path': `${label_id}/label`,
    'payload': {'user': psid}
  }
  return this.callCustomLabelsApi(options);
}

function removePsidfromCustomLabel (psid, label_id) {
  if (!psid || !label_id) {
    console.error('PSID and label_id required');
    return;
  }
  let options = {
    'method': 'DELETE',
    'path': `${label_id}/label`,
    'payload': {'user': psid}
  }
  return this.callCustomLabelsApi(options);
}

function callCustomLabelsApi (options) {
  let request_options = {'api_version': 'v2.11'};
  
  if (options.path) {
    request_options.path = `/${options.path}`;
  } else {
    request_options.path = '/me/custom_labels';
  }

  if (options.method) request_options.method = options.method;

  if (options.payload) request_options.payload = options.payload;
  
  return this.sendGraphRequest(request_options);
}

module.exports = {
  createCustomLabel,
  getCustomLabel,
  getCustomLabelsByPsid,
  getAllCustomLabels,
  deleteCustomLabel,
  addPsidtoCustomLabel,
  removePsidfromCustomLabel,
  callCustomLabelsApi
};