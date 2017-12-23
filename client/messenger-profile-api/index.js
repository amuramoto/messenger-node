function setMessengerProfile (fields) {
  if (!fields) {
    console.error('Valid "fields" object required')
    return;
  }

  return this.callMessengerProfileApi(fields);
}

function getMessengerProfile (fields) {
  if (!fields) {
    console.error('Valid "fields" array required')
    return;
  }
  fields = fields.join(',');
  return  this.callMessengerProfileApi(fields);
}

function deleteMessengerProfile (fields) {
  if (!fields) {
    console.error('Valid "fields" array required')
    return;
  }

  fields = fields.join(',');
  
  return this.callMessengerProfileApi(fields);
}

function callMessengerProfileApi(fields) {

  let options = {
    'path': '/me/messenger_profile'
  }

  if (typeof fields === 'string') {
    options.qs = {'fields': fields};
  } else if (typeof fields === 'object') {
    options.payload = fields;
  }

  return this.send(options);

}

module.exports = {
  setMessengerProfile,
  getMessengerProfile,
  deleteMessengerProfile,
  callMessengerProfileApi
};