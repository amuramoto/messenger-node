function Person (GraphRequest) {
  this.getProfile = getProfile.bind(GraphRequest);  
}

function getProfile (psid, fields) {
  return new Promise (async (resolve, reject) => {
    if (!psid || !fields) {
      reject('PSID and fields required');
    }
    fields = fields.join(',');
    let request_options = {
      'endpoint': '/' + psid,
      'qs': {'fields': fields}
    }

    try {
      let response = await this.sendGraphRequest(options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = Person;