

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
  let payload = {'name': name};
  this.send(payload);
}

function getLabel (label_id, fields) {
  if (!label_id || !fields) {
    console.error('label_id and fields required');
    return;
  }
}

function getByPsid (psid) {
  if (!psid) {
    console.error('PSID required');
    return;
  }
}

function getAllLabels () {

}

function deleteLabel (label_id) {
  if (!label_id) {
    console.error('label_id required');
    return;
  }
}

function removePsid (psid, label_id) {
  if (!psid || !label_id) {
    console.error('PSID and label_id required');
    return;
  }
}

function addPsid (psid, label_id) {
  if (!psid || !label_id) {
    console.error('PSID and label_id required');
    return;
  }
}

function send (options) {
  let request_options = {'api_version': 'v2.11'};
  
  if (!options.id) {
    request_options.path = `/${options.id}`
  } else {
    request_options.path = '/me/custom_labels'
  }

  if (options.method) request_options.method = options.method;

  if (options.payload) request_options.payload = options.payload;

  this.sendGraphRequest(request_options);
}

module.exports = Labels;