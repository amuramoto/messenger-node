'use strict';

const Client = require('./util/client-generator');

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