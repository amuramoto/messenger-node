'use strict';

const template_mocks = require('./util/template_mocks'),
      PSID = process.env.TEST_PSID,
      Client = require('./util/client-generator');

/* SEND API TESTS */ 
describe('Send API', () => {

  let recipient = {'id': PSID};
  
  test('Send text message', done => {    
    Client.sendText(recipient, 'test').then(res => {
      expect(res).toHaveProperty('recipient_id');
      expect(res).toHaveProperty('message_id');
      done();
    });
  });

  describe('Send Attachment', () => {
    let options = {
      'URL': {
        'type':'image', 
        'source':'https://github.com/amuramoto/messenger-node/raw/master/tests/client/assets/dog.jpg', 
        'is_reusable': true      
      },
      'file': {
        'type': 'image', 
        'source': __dirname + '/assets/dog.jpg', 
        'is_reusable': true      
      }
    };

    for (let attachment_type in options) {
      test(`Send attachment from ${attachment_type}`, done => {    
        Client.sendAttachment(options[attachment_type], recipient).then(res => {
          expect(res).toHaveProperty('recipient_id');
          expect(res).toHaveProperty('message_id');
          expect(res).toHaveProperty('attachment_id');
          done();
        });
      });
    }
    
  });

  test('Send sender actions', done => {
    let sender_actions = ['mark_seen', 'typing_on', 'typing_off'];
    let promises = [];
    sender_actions.forEach(action => {      
      promises.push(Client.sendSenderAction(recipient, action));
    });
    
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
        'image_url':'https://github.com/amuramoto/messenger-node/raw/master/tests/client/assets/dog.jpg',
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
    ];
    

    Client.sendQuickReplies(recipient, quick_replies, text).then(res => {
      expect(res).toHaveProperty('recipient_id');
      expect(res).toHaveProperty('message_id');
      done();
    });
  });

  describe('Send Templates', () => {
    template_mocks.forEach(options => {      
      test(`Send ${options.template_type} template`, done => {    
        jest.setTimeout(15000);
        Client.sendTemplate(recipient, options).then(res => {
          expect(res).toHaveProperty('recipient_id');
          expect(res).toHaveProperty('message_id');
          done();
        });
      });  
    });    
  });

});