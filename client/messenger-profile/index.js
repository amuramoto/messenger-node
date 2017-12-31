function MessengerProfile (GraphRequest) {
  this.send = send.bind(GraphRequest);
  this.get = getMessengerProfile;
  this.set = setMessengerProfile;
  this.delete = deleteMessengerProfile;
}

function setMessengerProfile (fields) {
  return new Promise (async (resolve, reject) => {
    if (!fields) {
      reject('Valid "fields" object required');
    }
    
    try {
      let response = await this.send(fields);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function getMessengerProfile (fields) {
  return new Promise (async (resolve, reject) => {
    if (!fields) {
      reject('Valid "fields" array required');
    }
    fields = fields.join(',');
    
    try {
      let response = await this.send(fields);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteMessengerProfile (fields) {
  return new Promise (async (resolve, reject) => {
    if (!fields) {
      reject('Valid "fields" array required');
    }

    fields = fields.join(',');
    
    try {
      let response = await this.send(fields);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function send(fields) {
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