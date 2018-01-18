const IdMatching = require('./id-matching'),
  UserProfile = require('./user-profile');

function Person (GraphRequest) {
  Object.assign(this, new IdMatching(GraphRequest), new UserProfile(GraphRequest));
}

module.exports = Person;