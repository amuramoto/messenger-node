function IdMatching (GraphRequest) {
  this.getMatchingPsids = getMatchingPsids;
  this.getMatchingAsids = getMatchingAsids;
  this.callIdMatchingApi = callIdMatchingApi.bind(GraphRequest);
}

function matchPsids (id_type, id) {
  return new Promise (async (resolve, reject) => {
    if (!id_type || !id) {
      reject('id_type and id required');
    }  
    
    let options = {
      'endpoint': `/${id}/ids_for_pages`,
      'qs': {'access_token':}
    }
    
    try {
      let response = await this.send(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function matchAsids (id_type, id) {
  return new Promise (async (resolve, reject) => {
    if (!id_type || !id) {
      reject('id_type and id required');
    }
    options.endpoint = `/${id}/ids_for_apps`
    
    try {
      let response = await this.send(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function callIdMatchingApi (options) {
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Options object required');
    }
    let path;
    let request_options = {
      'qs': options.qs || {}    
    };
    
    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = Person;