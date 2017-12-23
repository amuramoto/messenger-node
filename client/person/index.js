function Person (GraphRequest) {
  this.getProfile = getProfile.bind(GraphRequest);
  
}

function getProfile (psid, fields) {
  let fields = fields.join(',');
  let options = {
    'path': `/${psid}`,
    'qs': {'fields': fields}
  }

  return this.sendGraphRequest(options);
}


module.exports = Person;