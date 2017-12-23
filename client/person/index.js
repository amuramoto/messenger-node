function Person (GraphRequest) {
  this.getProfile = getProfile.bind(GraphRequest);  
  this.getMatchingPsids = getMatchingPsids.bind(GraphRequest);
  this.getMatchingAsids = getMatchingAsids.bind(GraphRequest);
}

function getProfile (psid, fields) {
  let fields = fields.join(',');
  let request_options = {
    'path': `/${psid}`,
    'qs': {'fields': fields}
  }

  return this.sendGraphRequest(request_options);
}

function getMatchingPsids (options) {
  let request_options = {
    'path': `/${options.id}/ids_for_pages`
  }
  if (options.id_type === 'asid') {
    request_options.qs = {'access_token': this.app_token};
  }

  return this.sendGraphRequest(request_options);  
}

function getMatchingAsids (options) {
  let request_options = {
    'path': `/${options.id}/ids_for_apps`
  }
  if (options.id_type === 'asid') {
    request_options.qs = {'access_token': this.app_token};
  }

  return this.sendGraphRequest(request_options);
}

module.exports = Person;