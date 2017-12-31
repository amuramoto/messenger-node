function Person (GraphRequest) {
  this.getProfile = getProfile;  
  this.getMatchingPsids = getMatchingPsids;
  this.getMatchingAsids = getMatchingAsids;
  this.send = send.bind(GraphRequest);
}

function getProfile (psid, fields) {
  return new Promise (async (resolve, reject) => {
    if (!psid || !fields) {
      reject('PSID and fields required');
    }
    fields = fields.join(',');
    let options = {
      'id': psid,
      'qs': {'fields': fields}
    }

    try {
      let response = await this.send(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getMatchingPsids (options) {
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Options object required');
    }  
    options.endpoint = 'ids_for_pages'
    
    try {
      let response = await this.send(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getMatchingAsids (options) {
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Options object required');
    }
    options.endpoint = 'ids_for_apps'
    
    try {
      let response = await this.send(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function send (options) {
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Options object required');
    }
    let path;
    let request_options = {
      'path': `/${options.id}`,
      'qs': options.qs || {}    
    };
    
    if (options.endpoint) request_options.path += `/${options.endpoint}`;

    if (options.id_type === 'asid') {
      request_options.qs.access_token = this.getAppToken();
    }

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = Person;