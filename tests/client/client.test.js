'use strict';

const Messenger = require('../../lib/index.js'),
      PAGE_TOKEN = process.env.TEST_PAGE_TOKEN,
      APP_TOKEN = process.env.TEST_APP_TOKEN;

const Client = require('./util/client-generator');

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