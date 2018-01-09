function MessengerProfile (GraphRequest) {
  this.callMessengerProfileApi = callMessengerProfileApi.bind(GraphRequest);
  this.get = getMessengerProfile;
  this.set = setMessengerProfile;
  this.delete = deleteMessengerProfile;
}

function setMessengerProfile (fields) {
  return new Promise (async (resolve, reject) => {
    if (!fields) {
      reject('fields must be an array');
    }
    
    try {
      let response = await this.callMessengerProfileApi(fields);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getMessengerProfile (fields) {
  return new Promise (async (resolve, reject) => {
    if (fields && !Array.isArray(fields)) {
      reject('Valid fields array required');
    }

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
      ]
    }

    fields = fields.join(',');
    
    try {
      let response = await this.callMessengerProfileApi(fields);
      resolve(JSON.parse(response));
    } catch (e) {
      reject(e);
    }
  });
}

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
    if (!fields) {
      reject('Valid "fields" array required');
    }
    
    let options = {
      'path': '/me/messenger_profile'
    }

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