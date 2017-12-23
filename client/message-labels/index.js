

function Labels (GraphRequest) {
  this.create = createLabel;
  this.get = getLabel;
  this.getByPsid = getByPsid;
  this.getAll = getAllLabels;
  this.delete = deleteLabel;
  this.removePsid = removePsid;
  this.addPsid = addPsid;
  this.send = send.bind(GraphRequest);
}

function createLabel (name) {
  if (!name) {
    console.error('name required');
    return;
  }
  let options = {
    'payload': {'name': name}
  };
  return this.send(options);
}

function getLabel (label_id, fields) {
  if (!label_id || !fields) {
    console.error('label_id and fields required');
    return;
  }
  let options = {
    'id': label_id,
    'qs': {'fields': fields}
  }
  return this.send(options);
}

function getByPsid (psid) {
  if (!psid) {
    console.error('PSID required');
    return;
  }

  let options = {
    'id': `${psid}/label`
  }

  return this.send(options);
}

function getAllLabels (fields) {
  if (!fields) {
    console.error('Fields required');
    return;
  }
  let options = {
    'qs': {'fields': fields}
  }
  return this.send(options);
}

function deleteLabel (label_id) {
  if (!label_id) {
    console.error('label_id required');
    return;
  }
  let options = {
    'method': 'DELETE',
    'id': 'label_id'
  }

  return this.send(options);
}

function addPsid (psid, label_id) {
  if (!psid || !label_id) {
    console.error('PSID and label_id required');
    return;
  }
  let options = {
    'id': `${label_id}/label`,
    'payload': {'user': psid}
  }
  return this.send(options);
}

function removePsid (psid, label_id) {
  if (!psid || !label_id) {
    console.error('PSID and label_id required');
    return;
  }
  let options = {
    'method': 'DELETE',
    'id': `${label_id}/label`,
    'payload': {'user': psid}
  }
  return this.send(options);
}

function send (options) {
  let request_options = {'api_version': 'v2.11'};
  
  if (options.id) {
    request_options.path = `/${options.id}`
  } else {
    request_options.path = '/me/custom_labels'
  }

  if (options.method) request_options.method = options.method;

  if (options.payload) request_options.payload = options.payload;

  this.sendGraphRequest(request_options);
}

module.exports = Labels;