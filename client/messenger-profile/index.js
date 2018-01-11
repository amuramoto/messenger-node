function MessengerProfile (GraphRequest) {  
  this.getMessengerProfile = getMessengerProfile;
  this.setMessengerProfile = setMessengerProfile;
  this.deleteMessengerProfile = deleteMessengerProfile;
  this.callMessengerProfileApi = callMessengerProfileApi.bind(GraphRequest);
}

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
      ]
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