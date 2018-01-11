function IdMatching (GraphRequest) {
  this.getMatchingPsids = getMatchingPsids;
  this.getMatchingAsids = getMatchingAsids;
  this.callIdMatchingApi = callIdMatchingApi.bind(GraphRequest);  
}

function getMatchingPsids (id_type, id) {
  return new Promise (async (resolve, reject) => {        
    try {
      let response = await this.callIdMatchingApi(id, id_type, 'psid');
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getMatchingAsids (id_type, id) {
  return new Promise (async (resolve, reject) => {
    try {
      let response = await this.callIdMatchingApi(id, id_type, 'asid');
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function callIdMatchingApi (id, id_type, get_type) {
  return new Promise (async (resolve, reject) => {
    if (!id || !id_type || !get_type) {
      reject('id, id_type, and get_type required');
    }

    let request_options = {};

    switch (get_type) {
      case 'psid':
        request_options.path = `/${id}/ids_for_pages`;
        break;
      case 'asid':
        request_options.path = `/${id}/ids_for_apps`;
        break;
    }

    if (id_type.toLowerCase() === 'asid') {
      request_options.qs = {'access_token': this.getAppToken()};
    }

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = IdMatching;