function UserProfile (GraphRequest) {
  this.getUserProfile = getUserProfile.bind(GraphRequest);  
}

/**
 * Retrieves a user's profile.
 * @param  {Integer}  psid  A valid user PSID.
 * @param  {Array<String>}  fields  _Optional._ An array list of the user profile filds to retrieve. For a list of available fields, see the {@link https://developers.facebook.com/docs/messenger-platform/identity/user-profile#fields|Messenger Platform docs}.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let profile_fields = [
 *   'id',
 *   'first_name',
 *   'last_name',
 *   'profile_pic',
 *   'locale',
 * ];
 * Client.getUserProfile('490730697356', profile_fields)
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //   "first_name": "Peter",
 *     //   "last_name": "Chang",
 *     //   "profile_pic": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p200x200/13055603_10105219398495383_8237637584159975445_n.jpg?oh=1d241d4b6d4dac50eaf9bb73288ea192&oe=57AF5C03&__gda__=1470213755_ab17c8c8e3a0a447fed3f272fa2179ce",
 *     //   "locale": "en_US", 
 *     // }
 *   });
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