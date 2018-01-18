'use strict';

const Client = require('./util/client-generator');

jest.mock('../../client/graph-api', () => { 
  function GraphRequest(){
    this.sendGraphRequest = () => {
      return new Promise((resolve, reject) => {
        resolve('ok');
      }); 
    }

    this.getPageToken = () => { return 'token' }
  } 
  return GraphRequest
});


test('Sponsored Message', done => {
  
  let options = {
    'message_creative_id': 'test',
    'daily_budget': 'test',
    'bid_amount': 'test',
    'targeting': 'test',
    'ad_account_id': 'test' 
  }
  Client.sendSponsoredMessage('test', options).then(res => {
    expect(res).toEqual('ok');
    done();
  })
});