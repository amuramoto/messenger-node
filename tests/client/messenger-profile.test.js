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
    },
    'persistent_menu': [
      {
        'locale': 'default',
        'composer_input_disabled': false,
        'call_to_actions': [
          {
            'title': 'Explore the night',
            'type': 'nested',
            'call_to_actions': [
              {
                'title': 'Buy a section',
                'type': 'postback',
                'payload': 'BUY_SECTION'
              },
              {
                'title': 'Buy a bottle',
                'type': 'postback',
                'payload': 'BUY_BOTTLE'
              },
              {
                'title': 'Win a section',
                'type': 'postback',
                'payload': 'WIN_SECTION'
              }
            ]
          }
        ]
      }
    ]
  };

  let fields_arr = Object.keys(fields);

  test('Set profile fields', done => {
    Client.setMessengerProfile(fields).then(res => {
      expect(res).toHaveProperty('result');
      expect(res.result).toEqual('success');
      done();
    });
  });

  test('Get profile fields', done => {      
    [null, fields_arr].forEach(field_list => {
      Client.getMessengerProfile(field_list).then(res => {
        let keys = Object.keys(res.data[0]);
        expect(res).toHaveProperty('data');
        expect(keys).toEqual(expect.arrayContaining(fields_arr));        
        done();
      });
    });  
  });

  test('Delete profile fields', done => {
    Client.deleteMessengerProfile(fields_arr).then(res => {
      expect(res).toHaveProperty('result');
      expect(res.result).toEqual('success');
      done();
    }).catch(e => console.log(JSON.stringify(e)));
  });
  
});