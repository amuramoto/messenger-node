'use strict';

const template_mocks = require('./util/template_mocks'),
      PSID = process.env.TEST_PSID,
      Client = require('./util/client-generator');

describe('Broadcast Message', () => {
  var message_creatives = [],
      custom_label,
      broadcast_id,
      reach_estimation_id,
      messages = [
        {'text': 'test broadcast'},
        template_mocks[0]
      ]    

  describe('Custom labels - creation', () => {
    test('Create label', done => {
      Client.createCustomLabel('sdk_test_label').then(res => {
        expect(res).toHaveProperty('id');
        custom_label = res.id;
        done(); 
      });
    });

    test('Get label by ID', done => {
      Client.getCustomLabelById(custom_label, ['name','id']).then(res => {
        expect(res).toHaveProperty('id');
        expect(res).toHaveProperty('name');
        expect(res.id).toEqual(custom_label);
        expect(res.name).toEqual('sdk_test_label');        
        done();
      });          
    });

    test('Get all labels', done => {
      Client.getAllCustomLabels(['name', 'id']).then(res => {
        expect(res).toHaveProperty('data');
        expect(res).toHaveProperty('paging');        
        done();
      });          
    });

    test('Associate label to PSID', done => {
      Client.addPsidtoCustomLabel(PSID, custom_label).then(res => {
        expect(res).toHaveProperty('success');
        expect(res.success).toEqual(true);        
        done();
      });          
    });

    test('Get custom labels by PSID', done => {
      Client.getCustomLabelsByPsid(PSID).then(res => {
        expect(res).toHaveProperty('data');
        expect(res).toHaveProperty('paging');        
        done();
      });          
    });
  });  

  describe('Message creatives', () => {
    messages.forEach(message => {
      let message_type = message.text ? 'text': `${message.template_type} template`;
      test(`Create ${message_type} message creative`, done => {        
          Client.createMessageCreative(message).then(res => {
            expect(res).toHaveProperty('message_creative_id');
            message_creatives.push({'type': message_type, 'id': res.message_creative_id});  
            done();
          });            
      });
    });
  });

  describe('Broadcast API', () => {    

    for(let i = 0; i < 2; i++) {
      let test_type = i === 0 ? 'all broadcasts' : 'targetted broadcast'
      test(`Start reach estimation for ${test_type}`, done => {
        let label = i === 0 ? null : custom_label;
        Client.startBroadcastReachEstimation(label).then(res => {
          expect(res).toHaveProperty('reach_estimation_id');                  
          reach_estimation_id = res.reach_estimation_id;
          done();
        });          
      });
    };

    test(`Get reach estimation`, done => {
      Client.getBroadcastReachEstimation(reach_estimation_id).then(res => {
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
        Client.sendBroadcast(message_creatives[i].id, custom_label).then(res => {
          expect(res).toHaveProperty('broadcast_id');
          done();
        })
      });
    };    
  });  

  describe('Custom labels - deletion', () => {
    test('Remove label from PSID', done => {
      Client.removePsidfromCustomLabel(PSID, custom_label).then(res => {
        expect(res).toHaveProperty('success');
        expect(res.success).toEqual(true);        
        done();
      });          
    });

    test('Delete label', done => {
      Client.deleteCustomLabel(custom_label).then(res => {
        expect(res).toHaveProperty('success');
        expect(res.success).toEqual(true);        
        done();
      });          
    });
  });    
});      