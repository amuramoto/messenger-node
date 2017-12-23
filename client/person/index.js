function Person (GraphRequest) {
  this.getProfile = getProfile;  
  this.getMatchingPsids = getMatchingPsids;
  this.getMatchingAsids = getMatchingAsids;
  this.send = send.bind(GraphRequest);
}

function getProfile (psid, fields) {
  fields = fields.join(',');
  let options = {
    'id': psid,
    'qs': {'fields': fields}
  }

  return this.send(options);
}

function getMatchingPsids (options) {  
  options.endpoint = 'ids_for_pages'
  return this.send(options);  
}

function getMatchingAsids (options) {
  options.endpoint = 'ids_for_apps'
  return this.send(options);
}

function send (options) {
  let path;
  let request_options = {
    'path': `/${options.id}`,
    'qs': options.qs || {}    
  };
  
  if (options.endpoint) request_options.path += `/${options.endpoint}`;

  if (options.id_type === 'asid') {
    request_options.qs.access_token = this.getAppToken();
  }

  return this.sendGraphRequest(request_options);  
}

module.exports = Person;