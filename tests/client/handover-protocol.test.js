'use strict';

const Client = require('./util/client-generator'),
      PSID = process.env.TEST_PSID,
      Metadata = 'this is metadata',
      Primary_Receiver = process.env.TEST_PRIMARY_RECEIVER,
      Seondary_Receiver = process.env.TEST_SECONDARY_RECEIVER;

describe('Handover Protocol', () => {
  test('Pass thread control', done => {
    Client.passThreadControl(PSID, Seondary_Receiver, Metadata).then(res => {
      expect(res).toHaveProperty('success');
      expect(res.success).toEqual(true);
      done();
    });
  });

  test('Take thread control', done => {    
    Client.takeThreadControl(PSID, Metadata).then(res => {
      expect(res).toHaveProperty('success');
      expect(res.success).toEqual(true);
      done();
    });
  });

  test('Request thread control', done => {
    let options = {
      'page_token': process.env.TEST_SECONDARY_PAGE_TOKEN,
      'graph_api_version': ''
    };
    const Messenger = require('../../lib/index.js'),
          Secondary_Client = new Messenger.Client(options);

    Secondary_Client.requestThreadControl(PSID, Metadata).then(res => {
      expect(res).toHaveProperty('success');
      expect(res.success).toEqual(true);
      done();
    });
  });

  test('Get thread owner', done => {
    Client.getThreadOwner(PSID).then(res => {
      expect(res).toHaveProperty('data');
      expect(res.data[0]).toHaveProperty('thread_owner');
      expect(res.data[0].thread_owner).toHaveProperty('app_id');
      expect(res.data[0].thread_owner.app_id).toEqual(Primary_Receiver);
      done();
    });
  });

  test('Get secondary receiver list', done => {
    Client.getSecondaryReceiverList(PSID).then(res => {
      expect(res).toHaveProperty('data');
      expect(res.data.length).toBeGreaterThan(0);
      done();
    });
  });
});