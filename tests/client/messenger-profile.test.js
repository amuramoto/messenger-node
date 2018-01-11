'use strict';

const Client = require('./util/client-generator');

describe('Messenger Profile API', () => {

  // doesn't include payament_settings since that can't be updated yet
  let fields = {
    'whitelisted_domains': ['https://www.messenger.com'],    
    'get_started': {
      'payload': 'callback_payload'
    },
    'greeting': [
      {
        'locale':'default',
        'text':'Hello!'
      }, {
        'locale':'en_US',
        'text':'Timeless apparel for the masses.'
      }
    ],    
    'target_audience': {
      'audience_type':'custom',
      'countries':{
        'whitelist':['US', 'CA']
      }
    }
  }

  let fields_arr = Object.keys(fields);

  test('Set profile fields', done => {
    Client.MessengerProfile.set(fields).then(res => {
      expect(res).toHaveProperty('result');
      expect(res.result).toEqual('success');
      done()
    })
  });

  test('Get profile fields', done => {      
    [null, fields_arr].forEach(field_list => {
      Client.MessengerProfile.get(field_list).then(res => {
        let keys = Object.keys(res.data[0]);
        expect(res).toHaveProperty('data');
        expect.arrayContaining(fields_arr);        
        done();
      })
    });  
  });

  test('Delete profile fields', done => {
    Client.MessengerProfile.delete(fields_arr).then(res => {
      expect(res).toHaveProperty('result');
      expect(res.result).toEqual('success');
      done();
    })
  });
  
});