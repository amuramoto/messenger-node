const webhook_events = {
  'messages.text': {
    'message': {
      'mid':'mid.1457764197618:41d102a3e1ae206a38',
      'text': 'text message'
    }
  },
  'messages.attachment': {
    'message': {
      'mid':'mid.1458696618141:b4ef9d19ec21086067',
      'attachments':[
        {
          'type':'image',
          'payload':{
            'url':'<IMAGE_URL>'
          }
        }
      ]
    }
  },
  'messages.quick_reply': {
    'message': {
      'quick_reply': {
        'payload': 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN'
      },
      'mid': 'mid.$cAAJsujCd2ORkHXKOOVd7C1F97Zto',
      'seq': 9767,
      'text': 'Green'
    }
  },
  'messaging_echoes': {
    'message': {
      'is_echo':true,
      'app_id':1517776481860111,
      'metadata': '<DEVELOPER_DEFINED_METADATA_STRING>',
      'mid':'mid.1457764197618:41d102a3e1ae206a38',
      'text':'hello, world!'
    }
  },
  'messaging_postbacks': {
    'postback': {
      'title': '<TITLE_FOR_THE_CTA>',  
      'payload': '<USER_DEFINED_PAYLOAD>',
      'referral': {
        'ref': '<USER_DEFINED_REFERRAL_PARAM>',
        'source': '<SHORTLINK>',
        'type': 'OPEN_THREAD',
      }
    }    
  },
  'message_deliveries': {
    'delivery': {
      'mids':[
        'mid.1458668856218:ed81099e15d3f4f233'
      ],
      'watermark':1458668856253,
      'seq':37
    }
  },
  'message_reads': {
    'read': {
      'watermark':1458668856253,
      'seq':38
    }
  },
  'messaging_account_linking': {
    'account_linking':{
      'status':'linked',
      'authorization_code':'PASS_THROUGH_AUTHORIZATION_CODE'
    }
  },
  'messaging_checkout_updates': {
    'checkout_update': {
      'payload': 'DEVELOPER_DEFINED_PAYLOAD',
      'shipping_address': {
        'id': 10105655000959552,
        'country': 'US',
        'city': 'MENLO PARK',
        'street1': '1 Hacker Way',
        'street2': '',
        'state': 'CA',
        'postal_code': '94025'
      }
    }
  },
  'messaging_game_plays': {
    'game_play': {
      'game_id': '<GAME-APP-ID>',
      'player_id': '<PLAYER-ID>',
      'context_type': '<CONTEXT-TYPE:SOLO|THREAD>',
      'context_id': '<CONTEXT-ID>',
      'score': '<SCORE-NUM>',
      'payload': '<PAYLOAD>'
    }
  },
  'messaging_handovers.pass_thread_control': {
    'pass_thread_control':{
      'new_owner_app_id':'123456789',
      'metadata':'Additional content that the caller wants to set'
    }
  },
  'messaging_handovers.take_thread_control': {
    'take_thread_control':{
      'previous_owner_app_id':'123456789',
      'metadata':'additional content that the caller wants to set'
    }
  },
  'standby': {
    'message': {
      'mid':'mid.1457764197618:41d102a3e1ae206a38',
      'text': 'text message'
    }
  },
  'messaging_handovers.app_roles': {
    'app_roles':{
      '123456789':['primary_receiver']
    }
  },
  'messaging_optins': {
    'optin': {
      'ref': '<PASS_THROUGH_PARAM>',
      'user_ref': '<REF_FROM_CHECKBOX_PLUGIN>'
    }
  },
  'messaging_payments': {
    'payment': {
      'payload': 'DEVELOPER_DEFINED_PAYLOAD',
      'requested_user_info': {
        'shipping_address': {
          'street_1': '1 Hacker Way',
          'street_2': '',
          'city': 'MENLO PARK',
          'state': 'CA',
          'country': 'US',
          'postal_code': '94025'
        },
        'contact_name': 'Peter Chang',
        'contact_email': 'peter@anemailprovider.com',
        'contact_phone': '+15105551234'
      },
      'payment_credential': {
        'provider_type': 'stripe',
        'charge_id': 'ch_18tmdBEoNIH3FPJHa60ep123',
        'fb_payment_id': '123456789',
      },      
      'amount': {
        'currency': 'USD',
        'amount': '29.62'
      }, 
      'shipping_option_id': '123'
    }
  },
  'messaging_policy_enforcement': {
    'policy-enforcement':{
      'action':'block',
      'reason':'The bot violated our Platform Policies (https://developers.facebook.com/policy/#messengerplatform). Common violations include sending out excessive spammy messages or being non-functional.'
    }
  },
  'messaging_pre_checkouts': {
    'pre_checkout':{
      'payload':'xyz',
      'requested_user_info':{
        'shipping_address':{
          'name':'Tao Jiang',
          'street_1':'600 Edgewater Blvd',
          'street_2':'',
          'city':'Foster City',
          'state':'CA',
          'country':'US',
          'postal_code':'94404',
        },
        'contact_name':'Tao Jiang',
      },
      'amount':{
        'currency':'USD',
        'amount':'2.70',
      }     
    }
  },
  'messaging_referrals.SHORTLINK': {
    'referral': {
      'ref': '<REF_DATA_PASSED_IN_M.ME_PARAM>',
      'source': 'SHORTLINK',
      'type': 'OPEN_THREAD',
    }
  },
  'messaging_referrals.ADS': {
    'referral': {
      'ref': '<REF_DATA_IF_SPECIFIED_IN_THE_AD>',
      'ad_id': '<ID_OF_THE_AD>',
      'source': 'ADS',
      'type': 'OPEN_THREAD',
    }
  },
  'messaging_referrals.MESSENGER_CODE': {
    'referral': {
      'ref': '<REF_DATA_PASSED_IN_CODE>',
      'source': 'MESSENGER_CODE',
      'type': 'OPEN_THREAD',
    }
  },
  'messaging_referrals.DISCOVER_TAB': {
    'referral': {
      'source': 'DISCOVER_TAB',
      'type': 'OPEN_THREAD',
    }
  } 
};

function get (type, subtype) {
  return buildEventPayload(type, subtype);
}

function getAll () {  
  let events = {};
  for (let key in webhook_events) {    
    let key_arr = key.split('.');
    let type = key_arr[0];
    let subtype = key_arr[1] ? key_arr[1]: '';    
    events[key] = buildEventPayload(type, subtype);
  }
  return events;
}

function buildEventPayload (type, subtype) {
  let event = {
    'object': 'page',
    'entry': []
  };
  let key = !subtype ? type : type + '.' + subtype;
  let payload = {
    'sender': {'id': 'USER PSID'},
    'recipient': {'id': 'PAGE ID'}
  };
  Object.assign(payload, webhook_events[key]);
  if (type !== 'standby') {
    event.entry[0] = {
      'messaging': [payload]
    };
  } else {
    event.entry[0] = {
      'standby': [payload]
    };
  }
  return event;
} 

module.exports = {
  get,
  getAll
};