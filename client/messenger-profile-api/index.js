module.exports = MessengerProfile;

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
  
  let currentFieldValues = getFields();

  this.set = setFields;
  this.get = getFields;
  this.delete = deleteFields;
}

function setFields (fields) {
  if (!fields) {
    console.error('Valid "fields" object required')
    return;
  }
}

function getFields (fields) {
  if (!fields) {
    
  }

  fields = fields.join(',');
  

}

function deleteFields (fields) {
  if (!fields) {
    console.error('Valid "fields" array required')
    return;
  }

  fields = fields.join(',');

}