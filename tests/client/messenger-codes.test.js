'use strict';

const Client = require('./util/client-generator');

describe('Messenger Codes API', () => {
  test('Get Messenger Code', done => {
    let options = {
      'ref': 'referral_ref',
      'image_size': 500
    };
    Client.generateMessengerCode(options).then(res => {        
      expect(res).toHaveProperty('uri');    
      done();
    });
  });
});  