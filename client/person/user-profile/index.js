function UserProfile (GraphRequest) {
  this.getUserProfile = getUserProfile.bind(GraphRequest);  
}

/**
 * Retrieves a user's profile.
 * @param  {Integer}  psid  A valid user PSID.
 * @param  {Array<String>}  fields  _Optional._ An array list of the user profile filds to retrieve. For a list of available fields, see the {@link https://developers.facebook.com/docs/messenger-platform/identity/user-profile#fields|Messenger Platform docs}.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
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
    };

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = UserProfile;