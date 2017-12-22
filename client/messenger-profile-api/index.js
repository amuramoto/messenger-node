const platform = require('../platform')


function MessengerProfile () {
  let profile_fields = [
    'whitelisted_domains',
    'persistent_menu',
    'get_started',
    'greeting',
    'payment_settings',
    'home_url',
    'account_linking_url',
    'target_audience'
  ]

  let current_field_values = getFields().data;

  for (let field in current_field_values) {
    this[field] = current_field_values[field];
  }

  this.set = setFields;
  this.delete = deleteFields;
}

function setFields (fields) {
  if (!fields) {
    console.error('Valid "fields" object required')
    return;
  }
}

function getFields (fields) {
  
}

function deleteFields (fields) {
  if (!fields) {
    console.error('Valid "fields" array required')
    return;
  }

  fields = fields.join(',');

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

  this.platform.call(options);

}

module.exports = {
  Profile: MessengerProfile,
  callMessengerProfileApi: callMessengerProfileApi
};