function Event () {
  const now = new Date.now().getTime();

  const sender = { 
    "psid": {"id": "PSID"},
    "user_ref": {"user_ref": ""},
    "phone_number": {"phone_number": ""}
  };

  const mid = "mid.1457764197618:41d102a3e1ae206a38";

  const event = {
    "object":"page",
    "entry":[
      {
        "id": "PAGE_ID",
        "time": now,
        "messaging":[
          {          
            "recipient":{
              "id":"PAGE_ID"
            }
          }
        ]
      }
    ]
  };

}

const messages = {
  "sender": sender,
  "body": {
  "timestamp": now,
  "message":{
    "mid": mid,
    "text":"hello, world!",    
  }  
}

const messaging_postbacks = {
  "no_referrer": {
    "sender": sender,
    "timestamp": now,
    "postback":{
      "title": "<TITLE_FOR_THE_CTA>",
      "payload": "<USER_DEFINED_PAYLOAD>"     
    }
  },
  "m_me": {
    "sender": sender,
    "timestamp": now,
    "postback":{
      "title": "<TITLE_FOR_THE_CTA>",
      "payload": "<USER_DEFINED_PAYLOAD>",
      "referral": {
        "ref": "<USER_DEFINED_REFERRAL_PARAM>",
        "source": "<SHORTLINK>",
        "type": "OPEN_THREAD",
      }
    }
  },
  "ad_referral": {
    "sender": sender,
    "timestamp": now,
    "postback":{
      "title": "<TITLE_FOR_THE_CTA>",
      "payload": "<USER_DEFINED_PAYLOAD>",
      "referral": {
         "source": "ADS",
         "type": "OPEN_THREAD",
         "ad_id": "6045246247433",
         "ref": "myparam" // Only included if specified in "URL Params" in the Ad as "ref=myparam"
      }
    }
  },
  "messenger_code": {
    "sender": sender,
    "timestamp": now,
    "postback":{
      "title": "<TITLE_FOR_THE_CTA>",
      "payload": "<USER_DEFINED_PAYLOAD>",
      "referral": {
        "ref": "<REF_DATA_PASSED_IN_CODE>",
        "source": "MESSENGER_CODE",
        "type": "OPEN_THREAD",
      }
    }
  },
  "discover_tab": {
    "sender": sender,
    "timestamp": now,
    "postback":{
      "title": "<TITLE_FOR_THE_CTA>",
      "payload": "<USER_DEFINED_PAYLOAD>",
      "referral": {
        "source": "DISCOVER_TAB",
        "type": "OPEN_THREAD",
      }
    }
  },
}    

const message_deliveries = {
  "sender": sender,
  "delivery":{
    "mids":[
       mid
    ],
    "watermark":1458668856253,
    "seq":37
  }
}

const message_echoes = {
  "sender": sender,
  "timestamp": now,
  "message":{
    "is_echo":true,
    "app_id":1517776481860111,
    "metadata": "<DEVELOPER_DEFINED_METADATA_STRING>",
    "mid":mid,
    ...
  }
}

const message_reads = {
  "sender": sender,
  "timestamp": now,
  "read":{
    "watermark":1458668856253,
    "seq":38
  }
}

const messaging_account_linking ={
  "linked": {
    "sender": sender,
    "timestamp": now,
    "account_linking":{
      "status":"linked",
      "authorization_code":"PASS_THROUGH_AUTHORIZATION_CODE"
    }
  },
  "unlinked": {
    "sender": sender,
    "timestamp": now,
    "account_linking":{
      "status":"unlinked"
    }    
  }
}

const messaging_checkout_updates = {
  "sender": sender,
  "timestamp": 1473204787206,
  "checkout_update": {
    "payload": "DEVELOPER_DEFINED_PAYLOAD",
    "shipping_address": {
      "id": 10105655000959552,
      "country": "US",
      "city": "MENLO PARK",
      "street1": "1 Hacker Way",
      "street2": "",
      "state": "CA",
      "postal_code": "94025"
    }
  }
}

const messaging_handovers = {
  "pass_thread_control" = {
    "sender": sender,
    "timestamp": now,
    "pass_thread_control":{
      "new_owner_app_id":"123456789",
      "metadata":"Additional content that the caller wants to set"
    }
  },
  "take_thread_control": {
    "sender": sender,
    "timestamp": now,
    "take_thread_control":{
      "previous_owner_app_id":"123456789",
      "metadata":"additional content that the caller wants to set"
    }
  },
  "app_roles": {
    "sender": sender,
    "timestamp": now,
    "app_roles":{
      "123456789":["primary_receiver"]
    }
  }
}

const messaging_optins = {
  "sender": sender,
  "timestamp": 1234567890,
  "optin": {
    "ref": "<PASS_THROUGH_PARAM>",
    "user_ref": "<REF_FROM_CHECKBOX_PLUGIN>"
  }
}

const messaging_payments = {
  "provider": {
    "sender": sender,
    "timestamp": 1473208792799,
    "payment" {
      "payload": "DEVELOPER_DEFINED_PAYLOAD",
      "requested_user_info": {
        "shipping_address": {
          "street_1": "1 Hacker Way",
          "street_2": "",
          "city": "MENLO PARK",
          "state": "CA",
          "country": "US",
          "postal_code": "94025"
        },
        "contact_name": "Peter Chang",
        "contact_email": "peter@anemailprovider.com",
        "contact_phone": "+15105551234"
      },
     "payment_credential": {
        "provider_type": "stripe", # paypal if you are using paypal as provider
        "charge_id": "ch_18tmdBEoNIH3FPJHa60ep123",
        "fb_payment_id": "123456789",
      },      
      "amount": {
        "currency": "USD",
        "amount": "29.62"
      }, 
      "shipping_option_id": "123"
    }
  },
  "tokenized": {
    "sender": sender,
    "timestamp": 1473208792799,
    "payment": {
      "payload": "DEVELOPER_DEFINED_PAYLOAD",
      "requested_user_info": {
        "shipping_address": {
          "street_1": "1 Hacker Way",
          "street_2": "",
          "city": "MENLO PARK",
          "state": "CA",
          "country": "US",
          "postal_code": "94025"
        },
        "contact_name": "Peter Chang",
        "contact_email": "peter@anemailprovider.com",
        "contact_phone": "+15105551234"
      },
     "payment_credential": {
        "provider_type": "stripe", # paypal if you are using paypal as provider
        "charge_id": "ch_18tmdBEoNIH3FPJHa60ep123",
        "fb_payment_id": "123456789",
      },      
      "amount": {
        "currency": "USD",
        "amount": "29.62"
      }, 
      "shipping_option_id": "123"
    }
  }
}

const messaging_policy_enforcement = {
  "timestamp": now,
  "policy-enforcement":{
    "action":"block",
    "reason":"The bot violated our Platform Policies (https://developers.facebook.com/policy/#messengerplatform). Common violations include sending out excessive spammy messages or being non-functional."
  }
}


const messaging_pre_checkouts = {
  "sender": sender,
  "pre_checkout":{
    "payload":"xyz",
    "requested_user_info":{
      "shipping_address":{
        "name":"Tao Jiang",
        "street_1":"600 Edgewater Blvd",
        "street_2":"",
        "city":"Foster City",
        "state":"CA",
        "country":"US",
        "postal_code":"94404",
      },
      "contact_name":"Tao Jiang",
      },
      "amount":{
        "currency":"USD",
        "amount":"2.70",
      }
    }
  }
}


const messaging_referrals = {
  "m_me" {
    "sender": sender,
    "timestamp": now,
    "referral": {
      "ref": <REF_DATA_PASSED_IN_M.ME_PARAM>,
      "source": "SHORTLINK",
      "type": "OPEN_THREAD",
    }  
  },
  "ad_referral": {
    "sender": sender,
    "timestamp": now,
    "referral": {
      "ref": <REF_DATA_IF_SPECIFIED_IN_THE_AD>,
      "ad_id": <ID_OF_THE_AD>,
      "source": "ADS",
      "type": "OPEN_THREAD",
    }
  },
  "messenger_code": {
    "sender": sender,
    "timestamp": now,
    "referral": {
      "ref": <REF_DATA_PASSED_IN_CODE>,
      "source": "MESSENGER_CODE",
      "type": "OPEN_THREAD",
    }
  },
  "discover_tab": {
    "sender": sender,
    "timestamp": now,
    "referral": {
      "source": "DISCOVER_TAB",
      "type": "OPEN_THREAD",
    }
  }
}