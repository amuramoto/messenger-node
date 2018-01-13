/**
 * @namespace  UserProfile
 */
function UserProfile (GraphRequest) {
  this.getUserProfile = getUserProfile.bind(GraphRequest);  
}

/**
 * Retrieves a user's profile
 * @param  {Integer}  psid
 * @param  {Integer}  fields  _Optional._
 * @return {Promise<Object>}  The API response
 * @function  Client.getUserProfile
 * @memberof  UserProfile#
 */
function getUserProfile (psid, fields) {
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