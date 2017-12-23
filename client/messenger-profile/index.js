function MessengerProfile (GraphRequest) {
  this.send = send.bind(GraphRequest);
  this.get = getMessengerProfile;
  this.set = setMessengerProfile;
  this.delete = deleteMessengerProfile;
}

function setMessengerProfile (fields) {
  if (!fields) {
    console.error('Valid "fields" object required')
    return;
  }

  return this.send(fields);
}

function getMessengerProfile (fields) {
  if (!fields) {
    console.error('Valid "fields" array required')
    return;
  }
  fields = fields.join(',');
  return  this.send(fields);
}

function deleteMessengerProfile (fields) {
  if (!fields) {
    console.error('Valid "fields" array required')
    return;
  }

  fields = fields.join(',');
  
  return this.send(fields);
}

function send(fields) {
  if (!fields) {
    console.error('Valid "fields" array required')
    return;
  }
  
  let options = {
    'path': '/me/messenger_profile'
  }

  if (typeof fields === 'string') {
    options.qs = {'fields': fields};
  } else if (typeof fields === 'object') {
    options.payload = fields;
  }

  return this.sendGraphRequest(options);

}

module.exports = MessengerProfile;