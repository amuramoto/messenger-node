'use strict';

const Messenger = require('../../index.js'),
      constructor = require('../../client'), 
      request = require('request'),
      template_mocks = require('./template_mocks'),
      PAGE_TOKEN = process.env.TEST_PAGE_TOKEN,
      APP_TOKEN = process.env.TEST_APP_TOKEN,
      PSID = process.env.TEST_PSID;

let Client;

beforeAll(() => {
  let options = {
    'page_token': PAGE_TOKEN,
    'app_token': APP_TOKEN,
    'graph_api_version': ''
  }
  Client = new Messenger.Client(options);  
});


/* CLIENT TESTS */
test('Create new API client', () => {
  expect(Client).toEqual(expect.any(Messenger.Client));
});

test('Set/get client member variables', () => {
  // setters
  let new_page_token = Client.setPageToken('PAGE_TOKEN');
  let new_app_token = Client.setAppToken('APP_TOKEN');
  let new_api_version = Client.setApiVersion('2.11');
  expect(new_page_token).toEqual('PAGE_TOKEN');
  expect(new_app_token).toEqual('APP_TOKEN');
  expect(new_api_version).toEqual('v2.11');

  // getters
  expect(Client.getPageToken()).toEqual('PAGE_TOKEN');
  expect(Client.getAppToken()).toEqual('APP_TOKEN');
  expect(Client.getApiVersion()).toEqual('v2.11');

  // reset
  Client.setPageToken(PAGE_TOKEN);
  Client.setAppToken(APP_TOKEN);
  Client.setApiVersion('');  
});


/* ATTACHMENT UPLOAD API TESTS */
describe('Attachment Upload API', () => {

  let attachments = [
    {'type': 'audio', 'file': __dirname + '/assets/radio.mp3'}, 
    {'type': 'video', 'file': __dirname + '/assets/dog.mov'},
    {'type': 'image', 'file': __dirname + '/assets/dog.jpg'},
    {'type': 'file', 'file': __dirname + '/assets/dog.pdf'},
    {'type': 'audio', 'url': 'https://github.com/amuramoto/messenger-node/raw/master/__tests__/client/assets/radio.mp3' }, 
    {'type': 'video', 'url': 'https://github.com/amuramoto/messenger-node/raw/master/__tests__/client/assets/dog.mov' },
    {'type': 'image', 'url': 'https://github.com/amuramoto/messenger-node/raw/master/__tests__/client/assets/dog.jpg' },
    {'type': 'file', 'url': 'https://github.com/amuramoto/messenger-node/raw/master/__tests__/client/assets/dog.pdf' }
  ];

  attachments.forEach(attachment => {
    let source = attachment.file ? 'file':'url'; 
    test(`Upload ${attachment.type} from ${source}`, done => {
      jest.setTimeout(10000);
      Client.Attachment.upload(attachment).then(res => {
        expect(res).toHaveProperty('attachment_id');
        expect(res.attachment_id).toEqual(expect.any(String));
        done();
      });    
    });
  });
});


/* SEND API TESTS */ 
describe('Send API', () => {

  let recipient = {'id': PSID};
  
  test('Send text message', done => {    
    Client.Message.sendText(recipient, 'test').then(res => {
      expect(res).toHaveProperty('recipient_id');
      expect(res).toHaveProperty('message_id');
      done();
    });
  });

  test('Send attachment', done => {
    let options = {
      'type':'image', 
      'payload':{
        'url':'https://messenger.fb.com/wp-content/uploads/2017/04/messenger-logo.png', 
        'is_reusable':true
      }    
    }
    Client.Message.sendAttachment(recipient, options).then(res => {
      expect(res).toHaveProperty('recipient_id');
      expect(res).toHaveProperty('message_id');
      expect(res).toHaveProperty('attachment_id');
      done();
    });
  });

  test('Send sender actions', done => {
    let sender_actions = ['mark_seen', 'typing_on', 'typing_off'];
    let promises = [];
    sender_actions.forEach(action => {      
      promises.push(Client.Message.sendSenderAction(recipient, action));
    })
    
    Promise.all(promises).then(responses => {
      responses.forEach(res => {
        expect(res).toHaveProperty('recipient_id');
      });
      done();
    });
    
  });

  test('Send quick replies', done => {
    let text = 'These are quick replies!';
    let quick_replies = [
      {
        'content_type':'text',
        'title':'Quick Reply 1',
        'image_url':'https://messenger.fb.com/wp-content/uploads/2017/04/messenger-logo.png',
        'payload':'payload1'
      },
      {
        'content_type':'text',
        'title':'Quick Reply 2',
        'payload':'payload2'
      },
      {
        'content_type':'location'
      }
    ]
    

    Client.Message.sendQuickReplies(recipient, quick_replies, text).then(res => {
      expect(res).toHaveProperty('recipient_id');
      expect(res).toHaveProperty('message_id');
      done();
    });
  });

  describe('Send Templates', () => {
    template_mocks.forEach(options => {      
      test(`Send ${options.template_type} template`, done => {    
        jest.setTimeout(15000);
        Client.Message.sendTemplate(recipient, options).then(res => {
          expect(res).toHaveProperty('recipient_id');
          expect(res).toHaveProperty('message_id');
          done();
        });
      });  
    });    
  });

});

/* Messaging Insights API */

test('Get insights metrics', done => {
  let today = new Date().getTime();
  let options = {
    'metrics': [
      'page_messages_active_threads_unique',
      'page_messages_blocked_conversations_unique',
      'page_messages_reported_conversations_unique',
      'page_messages_reported_conversations_by_report_type_unique'
    ],
    'since': today - 864000,
    'until': today
  }
  Client.MessagingInsights.get(options).then(res => {    
    expect(res).toHaveProperty('data');
    expect(res).toHaveProperty('paging');    
    done();
  })
});


/* Messenger Codes API */

test('Get Messenger Code', done => {
  let options = {
    'ref': 'referral_ref',
    'image_size': 500
  }
  Client.MessengerCode.generate(options).then(res => {        
    expect(res).toHaveProperty('uri');    
    done();
  })
});


/* Messenger Profile API */


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

describe.only('Broadcast Message', () => {
  var message_creatives = [],
      custom_label,
      broadcast_id,
      reach_estimation_id,
      messages = [
        {'text': 'test broadcast'},
        template_mocks[0]
      ]    

  describe('Custom labels - creation', () => {
    test('Create label', async() => {
      try {
        let res = await Client.Message.createCustomLabel('test_label')
        
        expect(res).toHaveProperty('id');
        custom_label = res.id; 
      console.log(custom_label)
      } catch(e) {
        console.error(e);
      }
      
    });

    test('Get label by ID', done => {
      Client.Message.getCustomLabelById(custom_label, ['name','id']).then(res => {
        expect(res).toHaveProperty('id');
        expect(res).toHaveProperty('name');
        expect(res.id).toEqual(custom_label);
        expect(res.name).toEqual('test_label');        
        done();
      });          
    });

    test('Get all labels', done => {
      Client.Message.getAllCustomLabels(['name', 'id']).then(res => {
        expect(res).toHaveProperty('data');
        expect(res).toHaveProperty('paging');        
        done();
      });          
    });

    test('Associate label to PSID', done => {
      Client.Message.addPsidtoCustomLabel(PSID, custom_label).then(res => {
        expect(res).toHaveProperty('success');
        expect(res.success).toEqual(true);        
        done();
      });          
    });

    test('Get custom labels by PSID', done => {
      Client.Message.getCustomLabelsByPsid(PSID).then(res => {
        expect(res).toHaveProperty('data');
        expect(res).toHaveProperty('paging');        
        done();
      });          
    });
  });  

  describe('Message creatives', () => {
    messages.forEach(message => {
      let message_type = message.text ? 'text': `${message.template_type} template`;
      test(`Create ${message_type} message creative`, async() => {
        try {
          let res = await Client.Message.createMessageCreative(message);
          expect(res).toHaveProperty('message_creative_id');
          message_creatives.push({'type': message_type, 'id': res.message_creative_id});
        } catch(e) {
          console.error(e);
        }        
      });
    });
  });

  describe('Broadcast API', () => {    

    for(let i = 0; i < 2; i++) {
      let test_type = i === 0 ? 'all broadcasts' : 'targetted broadcast'
      test(`Start reach estimation for ${test_type}`, done => {
        let label = i === 0 ? null : custom_label;
        Client.Message.startBroadcastReachEstimation(label).then(res => {
          expect(res).toHaveProperty('reach_estimation_id');                  
          reach_estimation_id = res.reach_estimation_id;
          done();
        });          
      });
    };

    test(`Get reach estimation`, done => {
      Client.Message.getBroadcastReachEstimation(reach_estimation_id).then(res => {
        expect(res).toHaveProperty('id');          
        expect(res).toHaveProperty('reach_estimation');
        done();
      })
    });

    for(let i = 0; i < 2; i++) {
      let target  = i === 0 ? 'all users' : 'custom label'
      test(`Send Broadcast to ${target}`, done => {
        let label;
        if (i === 1) label = custom_label
        Client.Message.sendBroadcast(message_creatives[i].id, custom_label).then(res => {
          expect(res).toHaveProperty('broadcast_id');
          done();
        })
      });
    };    
  });  

  describe('Custom labels - deletion', () => {
    test('Remove label from PSID', done => {
      Client.Message.removePsidfromCustomLabel(PSID, custom_label).then(res => {
        expect(res).toHaveProperty('success');
        expect(res.success).toEqual(true);        
        done();
      });          
    });

    test('Delete label', done => {
      Client.Message.deleteCustomLabel(custom_label).then(res => {
        expect(res).toHaveProperty('success');
        expect(res.success).toEqual(true);        
        done();
      });          
    });
  });    
});

// test('', () => {

// });