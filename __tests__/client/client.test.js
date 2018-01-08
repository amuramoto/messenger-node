'use strict';

const Messenger = require('../../index.js'),
      constructor = require('../../client'), 
      request = require('request'),
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
})

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

describe('Attachment Upload API', () => {

  let attachments = [
    {'type': 'audio', 'file': __dirname + '/assets/radio.mp3'}, 
    {'type': 'video', 'file': __dirname + '/assets/dog.mov'},
    {'type': 'image', 'file': __dirname + '/assets/dog.jpg'},
    {'type': 'file', 'file': __dirname + '/assets/dog.pdf'},
    {'type': 'audio', 'url': '' }, 
    {'type': 'video', 'url': '' },
    {'type': 'image', 'url': '' },
    {'type': 'file', 'url': '' }
  ];


  
  attachments.forEach(attachment => {
    let source = attachment.file ? 'file':'url'; 
    test(`Upload ${attachment.type} from ${source}`, done => {
      jest.setTimeout(10000);
      Client.Attachment.upload(attachment).then(res => {
        res = JSON.parse(res);
        expect(res).toHaveProperty('attachment_id');
        expect(res.attachment_id).toEqual(expect.any(String));
        done();
      });    
    });
  });
});


// test('', () => {

// });

// test('', () => {

// });