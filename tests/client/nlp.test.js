'use strict';

const Client = require('./util/client-generator');

describe('Built-in NLP', () => {
  test('Set config', done => {
    let configs = {
      'nlp_enabled': true,
      'model': 'ENGLISH',
      'custom_token': process.env.TEST_WIT_TOKEN,
      'verbose': false,
      'n_best': 1
    };
    Client.setNlpConfigs(configs).then(res => {
      console.log(res);
      done();
    });
  });
});