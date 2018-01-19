function MessengerProfile (GraphRequest) {  
  this.getMessengerProfile = getMessengerProfile;
  this.setMessengerProfile = setMessengerProfile;
  this.deleteMessengerProfile = deleteMessengerProfile;
  this.callMessengerProfileApi = callMessengerProfileApi.bind(GraphRequest);
}

/**
 * Sets one or more properties of your bot's [Messenger Profile](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api).
 * @param  {Object}  fields  An object that contains the Messenger Profile properties to set as key-value pairs.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let fields = {
 *   'whitelisted_domains': ['https://www.example.com'],    
 *   'get_started': {
 *     'payload': 'callback_payload'
 *   },
 *   'greeting': [
 *     {
 *       'locale':'default',
 *       'text':'Hello!'
 *     }, {
 *       'locale':'en_US',
 *       'text':'Timeless apparel for the masses.'
 *     }
 *   ]
 * };
 * Client.setMessengerProfile(fields)
 *   .then(res => {
 *     console.log(res); // {"result": "success"}
 *   });
 */
function setMessengerProfile (fields) {
  return new Promise (async (resolve, reject) => {
    if (!fields || typeof fields !== 'object') {
      reject('valid fields object required');
    }
    
    try {
      let response = await this.callMessengerProfileApi(fields);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Retrieves one or more properties of your bot's [Messenger Profile](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api).
 * @param  {Array<String>}  fields  _Optional._ An array list of the Messenger Profile filds to retrieve.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let fields = ['whitelisted_domains', 'greeting'];
 * Client.getMessengerProfile(fields)
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //    "data": [
 *     //         {
 *     //           "whitelisted_domains": [
 *     //             "https://facebook.com/"
 *     //           ],
 *     //           "greeting": [
 *     //             {
 *     //                "locale": "default",
 *     //                "text": "Hello!"
 *     //             }
 *     //          ]
 *     //       }
 *     //    ]
 *     // } 
 *   });
 */
function getMessengerProfile (fields) {
  return new Promise (async (resolve, reject) => {
    if (!fields) {
      fields = [
        'account_linking_url',
        'persistent_menu',
        'get_started',
        'greeting',
        'whitelisted_domains',
        'payment_settings',
        'target_audience',
        'home_url'
      ];
    }

    fields = fields.join(',');
    
    try {
      let response = await this.callMessengerProfileApi(fields);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Deletes one or more properties of your bot's [Messenger Profile](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api).
 * @param  {Array<String>}  fields  _Optional._ An array list of the Messenger Profile filds to delete.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let fields = ['whitelisted_domains', 'greeting'];
 * Client.deleteMessengerProfile(fields)
 *   .then(res => {
 *     console.log(res); // {"id": "9485676932424"}
 *   });
 */
function deleteMessengerProfile (fields) {
  return new Promise (async (resolve, reject) => {
    if (!fields || !Array.isArray(fields)) {
      reject('Valid fields array required');
    }

    try {
      let response = await this.callMessengerProfileApi({'fields': fields});
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function callMessengerProfileApi(fields) {
  return new Promise (async (resolve, reject) => {
    let options = {
      'path': '/me/messenger_profile'
    };

    if (typeof fields === 'string') {
      options.qs = {'fields': fields};
    } else if (typeof fields === 'object') {
      options.payload = fields;      
      if (fields.fields) options.method = 'DELETE';
    }

    try {
      let response = await this.sendGraphRequest(options);      
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = MessengerProfile;