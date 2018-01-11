function UserProfile (GraphRequest) {
  this.getUserProfile = getProfile.bind(GraphRequest);  
}

function getProfile (psid, fields) {
  return new Promise (async (resolve, reject) => {
    if (!psid) {
      reject('PSID required');
    }

    if (!Array.isArray(fields)) {
      reject('fields must be an array');
    }

    let request_options = {
      'path': '/' + psid,
      'qs': {'fields': fields.join(',')}
    }

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = UserProfile;