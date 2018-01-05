'use strict';

const Messenger = require('../index.js'),
      constructor = require('../webhook'), 
      request = require('request'),
      webhook_mocks = require('./webhook-event-mocks'),
      webhook_settings = {
        'verify_token': 'token'
      };

let Webhook;

process.argv.forEach(arg => {
  let kv = arg.split('=');
  switch (kv[0]) {
    case 'verify_token':
      webhook_settings.verify_token = kv[1];
      break;

    case 'port':
      webhook_settings.port = kv[1];
      break;

    case 'endpoint':
      webhook_settings.endpoint = kv[1];
      break;
  }
});

beforeAll(() => {
  Webhook = new Messenger.Webhook(webhook_settings);  
})

test('Create new webhook', () => {
  expect(Webhook).toEqual(expect.any(Messenger.Webhook));
});

test('Get webhook instance', () => {
  let instance = Webhook.getInstance();  
  expect(instance).toBeInstanceOf(Object);
});

describe('Webhook verification', () => {
  let qs = {
    'hub.mode': 'subscribe',
    'hub.challenge': 'challenge'
  }

  let options = {
    'method': 'GET',
    'qs': qs
  }

  test('Send correct token', done => {        
    let callback = (err, res, body) => {
      expect(res.statusCode).toEqual(200);
      expect(body).toEqual(qs['hub.challenge']);
      done();
    };
    qs['hub.verify_token'] = Webhook.getVerifyToken();

    callWebhook(options, callback);
  });

  test('Send wrong token', done => {        
    let callback = (err, res, body) => {
      expect(res.statusCode).toEqual(403);
      done();
    };
    qs['hub.verify_token'] = 'wrong token';

    callWebhook(options, callback);
  });

})

describe('Emit events', () => {

  let options = {'method': 'POST'};
  let event_mocks = webhook_mocks.getAll();

  for (let name in event_mocks) {
    test(`Emit ${name}`, done => {      
      let event_type_arr = name.split('.');
      let event_type = event_type_arr[0];
      let event_subtype = event_type_arr[1];
      let callback = (err, res, body) => {
        expect(body).toEqual('EVENT_RECEIVED');
        expect(res.statusCode).toEqual(200);        
      }

      options.json = event_mocks[name];
   
      Webhook.once(event_type, (event) => {      
        expect(event.type).toEqual(event_type);
        if (event.subtype) expect(event.subtype).toEqual(event_subtype);
        done();
      });

      callWebhook(options, callback);
    })
  }

});


test('Stop webhook', () => {
  let server = Webhook.stopInstance((err) => {
    expect(err).toEqual(undefined);
  });  
});

function callWebhook (options, callback) {
  let request_options = {
    'uri': `http://127.0.0.1:${Webhook.getPort()}${Webhook.getEndpoint()}`,
    'method': options.method    
  };

  if (options.qs) request_options.qs = options.qs;
  if (options.json) request_options.json = options.json;
  request(request_options, callback);
}