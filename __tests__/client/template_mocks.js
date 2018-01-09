let generic = {
  template_type: 'generic',
  elements: [
    {
      'title':'This is a generic template',
      'subtitle':'Plus a subtitle!',
      'image_url':'https://github.com/amuramoto/messenger-node/raw/master/__tests__/client/assets/dog.jpg',
      'buttons':[
        {
        'type':'postback',
        'title':'Postback Button',
        'payload':'<POSTBACK_PAYLOAD>'
        },
        {
        'type': 'web_url',
        'title': 'URL Button',
        'url': 'https://messenger.fb.com/'
        }
      ]      
    }
  ]
}
  
let media = {
  'template_type': 'media',
  'elements': [
    {
       'media_type': 'image',
       'url': 'https://www.facebook.com/MessengerPlatform/photos/a.1534851423476297.1073741827.1534848353476604/1754854618142642/'
    }
  ]
}
  
let list = {
  'template_type': 'list',
  'top_element_style': 'compact',
  'elements': [
    {
      'title': 'Messenger',
      'subtitle': 'Chat',
      'image_url': 'https://messenger.fb.com/wp-content/uploads/2017/04/messenger-logo.png',          
      'buttons': [
        {
          'title': 'View',
          'type': 'web_url',
          'url': 'https://messenger.com',
          'webview_height_ratio': 'tall'
        }
      ]
    },
    {
      'title': 'Facebook',
      'subtitle': 'Social',
      'image_url': 'https://messenger.fb.com/wp-content/uploads/2017/04/messenger-logo.png',          
    }
  ],
   'buttons': [
    {
      'title': 'Send postback',
      'type': 'postback',
      'payload': 'payload'            
    }
  ]  
}

let button = {
  'template_type': 'button',
  'text':'This is a button template with a few different buttons.',
  'buttons':[
    {
      'type':'postback',
      'title':'Postback Button',
      'payload':'<POSTBACK_PAYLOAD>'
    },
    {
      'type':'phone_number',
      'title':'Call Button',
      'payload': '5555555555'
    }
  ]
}

let open_graph = {
  'template_type': 'open_graph',
  'elements':[
    {
      'url':'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
      'buttons':[
        {
          'type':'web_url',
          'url':'https://en.wikipedia.org/wiki/Rickrolling',
          'title':'View More'
        }              
      ]      
    }
  ]
}

let receipt = {
  'template_type': 'receipt',
  'recipient_name':'Customer 1',
  'order_number':'12345678902',
  'currency':'USD',
  'payment_method':'Visa 2345',        
  'order_url':'http://www.yourcompany.com/order?order_id=123456',
  'timestamp':'1428444852',         
  'address':{
    'street_1':'1 Hacker Way',
    'street_2':'',
    'city':'Menlo Park',
    'postal_code':'94025',
    'state':'CA',
    'country':'US'
  },
  'summary':{
    'subtotal':75.00,
    'shipping_cost':4.95,
    'total_tax':6.19,
    'total_cost':56.14
  },
  'adjustments':[
    {
      'name':'New Customer Discount',
      'amount':20
    },
    {
      'name':'$10 Off Coupon',
      'amount':10
    }
  ],
  'elements':[
    {
      'title':'Ice Cream',
      'subtitle':'Probably better than peaches',
      'quantity':2,
      'price':50,
      'currency':'USD',
      'image_url':'https://messenger.fb.com/wp-content/uploads/2017/11/icecream.jpg'
    },
    {
      'title':'Peaches',
      'subtitle':'Healthy and delicious',
      'quantity':1,
      'price':25,
      'currency':'USD',
      'image_url':'https://messenger.fb.com/wp-content/uploads/2017/11/peaches.png'
    }
  ]
}

let airline_boardingpass = {
  'template_type': 'airline_boardingpass',
  'intro_message': 'This is the boarding pass template',
  'locale': 'en_US',
  'boarding_pass': [
    {
      'passenger_name': 'SMITH\/NICOLAS',
      'pnr_number': 'CG4X7U',
      'seat': '74J',            
      'logo_image_url': 'https:\/\/www.example.com\/en\/logo.png',
      'header_image_url': 'https:\/\/www.example.com\/en\/fb\/header.png',
      'qr_code': 'M1SMITH\/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
      'above_bar_code_image_url': 'https:\/\/www.example.com\/en\/PLAT.png',
      'auxiliary_fields': [
        {
          'label': 'Terminal',
          'value': 'T1'
        },
        {
          'label': 'Departure',
          'value': '30OCT 19:05'
        }
      ],
      'secondary_fields': [
        {
          'label': 'Boarding',
          'value': '18:30'
        },
        {
          'label': 'Gate',
          'value': 'D57'
        },
        {
          'label': 'Seat',
          'value': '74J'
        },
        {
          'label': 'Sec.Nr.',
          'value': '003'
        }
      ],
      'flight_info': {
        'flight_number': 'KL0642',
        'departure_airport': {
          'airport_code': 'JFK',
          'city': 'New York',
          'terminal': 'T1',
          'gate': 'D57'
        },
        'arrival_airport': {
          'airport_code': 'SFO',
          'city': 'San Francisco'
        },
        'flight_schedule': {
          'departure_time': '2016-01-02T19:05',
          'arrival_time': '2016-01-05T17:30'
        }
      }
    }
  ]
}

let airline_checkin = {
  'template_type': 'airline_checkin',
  'intro_message': 'Check-in is available now.',
  'locale': 'en_US',        
  'pnr_number': 'ABCDEF',
  'checkin_url': 'https:\/\/www.airline.com\/check-in',  
  'flight_info': [
    {
      'flight_number': 'f001',
      'departure_airport': {
        'airport_code': 'SFO',
        'city': 'San Francisco',
        'terminal': 'T4',
        'gate': 'G8'
      },
      'arrival_airport': {
        'airport_code': 'SEA',
        'city': 'Seattle',
        'terminal': 'T4',
        'gate': 'G8'
      },
      'flight_schedule': {
        'boarding_time': '2016-01-05T15:05',
        'departure_time': '2016-01-05T15:45',
        'arrival_time': '2016-01-05T17:30'
      }
    }
  ]
}

let airline_itinerary = {
  'template_type': 'airline_itinerary',
  'intro_message': 'Here is your flight itinerary.',
  'locale': 'en_US',
  'pnr_number': 'ABCDEF',
  'passenger_info': [
    {
      'name': 'Farbound Smith Jr',
      'ticket_number': '0741234567890',
      'passenger_id': 'p001'
    },
    {
      'name': 'Nick Jones',
      'ticket_number': '0741234567891',
      'passenger_id': 'p002'
    }
  ],
  'flight_info': [
    {
      'connection_id': 'c001',
      'segment_id': 's001',
      'flight_number': 'KL9123',
      'aircraft_type': 'Boeing 737',
      'departure_airport': {
        'airport_code': 'SFO',
        'city': 'San Francisco',
        'terminal': 'T4',
        'gate': 'G8'
      },
      'arrival_airport': {
        'airport_code': 'SLC',
        'city': 'Salt Lake City',
        'terminal': 'T4',
        'gate': 'G8'
      },
      'flight_schedule': {
        'departure_time': '2016-01-02T19:45',
        'arrival_time': '2016-01-02T21:20'
      },
      'travel_class': 'business'
    },
    {
      'connection_id': 'c002',
      'segment_id': 's002',
      'flight_number': 'KL321',
      'aircraft_type': 'Boeing 747-200',
      'travel_class': 'business',
      'departure_airport': {
        'airport_code': 'SLC',
        'city': 'Salt Lake City',
        'terminal': 'T1',
        'gate': 'G33'
      },
      'arrival_airport': {
        'airport_code': 'AMS',
        'city': 'Amsterdam',
        'terminal': 'T1',
        'gate': 'G33'
      },
      'flight_schedule': {
        'departure_time': '2016-01-02T22:45',
        'arrival_time': '2016-01-03T17:20'
      }
    }
  ],
  'passenger_segment_info': [
    {
      'segment_id': 's001',
      'passenger_id': 'p001',
      'seat': '12A',
      'seat_type': 'Business'
    },
    {
      'segment_id': 's001',
      'passenger_id': 'p002',
      'seat': '12B',
      'seat_type': 'Business'
    },
    {
      'segment_id': 's002',
      'passenger_id': 'p001',
      'seat': '73A',
      'seat_type': 'World Business',
      'product_info': [
        {
          'title': 'Lounge',
          'value': 'Complimentary lounge access'
        },
        {
          'title': 'Baggage',
          'value': '1 extra bag 50lbs'
        }
      ]
    },
    {
      'segment_id': 's002',
      'passenger_id': 'p002',
      'seat': '73B',
      'seat_type': 'World Business',
      'product_info': [
        {
          'title': 'Lounge',
          'value': 'Complimentary lounge access'
        },
        {
          'title': 'Baggage',
          'value': '1 extra bag 50lbs'
        }
      ]
    }
  ],
  'price_info': [
    {
      'title': 'Fuel surcharge',
      'amount': '1597',
      'currency': 'USD'
    }
  ],
  'base_price': '12206',
  'tax': '200',
  'total_price': '14003',
  'currency': 'USD'
}

let airline_update = {
  'template_type': 'airline_update',
  'intro_message': 'Your flight is delayed',
  'update_type': 'delay',
  'locale': 'en_US',
  'pnr_number': 'CF23G2',
  'update_flight_info': {
    'flight_number': 'KL123',
    'departure_airport': {
      'airport_code': 'SFO',
      'city': 'San Francisco',
      'terminal': 'T4',
      'gate': 'G8'
    },
    'arrival_airport': {
      'airport_code': 'AMS',
      'city': 'Amsterdam',
      'terminal': 'T4',
      'gate': 'G8'
    },
    'flight_schedule': {
      'boarding_time': '2015-12-26T10:30',
      'departure_time': '2015-12-26T11:30',
      'arrival_time': '2015-12-27T07:30'
    }
  }
}


module.exports = [
  generic,
  media,
  list,
  button,
  open_graph,
  receipt,
  airline_itinerary,
  airline_update,
  airline_checkin,
  airline_boardingpass
]