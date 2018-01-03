const Messenger = require('../index.js'),
      constructor = require('../webhook'), 
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

test('Retrieve webhook instance', () => {
  let instance = Webhook.getInstance();  
  expect(instance).toBeInstanceOf(Object);
});

test('Stop webhook', () => {
  let server = Webhook.stopInstance((err) => {
    expect(err).toEqual(undefined);
  });  
});

