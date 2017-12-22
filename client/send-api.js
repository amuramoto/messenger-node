const payload = {},
      platform = require('./platform');

function SendApiPayload (options) {
  if (!options.recipient || !options.recipient.id || !options.recipient.type) {
    console.error('Invalid message recipient');
    return;
  }

  if (!options.messaging_type && new Date().getTime() >= 1525676400000) {
    console.error('messaging_type required');
    return;
  } else if (options.messaging_type) {
    this.messaging_type = options.messaging_type;   
  }

  this.message = {};
  this.recipient = {};
  this.recipient[options.recipient.type] = options.recipient.id;
  
}

function callSendApi (message_props, options) {
  let payload = new SendApiPayload(options);
  Object.assign(payload.message, message_props);
  return this.send('/messages', payload);
}

function sendText (options, callback) {

  if (!options.text) {
    console.error('"text" property required')
    return;
  }

  let message_props = {
    'text': options.text
  }

  return this.callSendApi(message_props, options);
}

function sendQuickReplies (options) {  
  if (!options.quick_replies) {
    console.error('"quick_replies" property required');
    return;
  }

  let message_props = {
    'quick_replies': options.quick_replies
  };

  if (options.text) messsage_props.text = options.text;
  if (options.attachment) messsage_props.attachment = options.attachment;
  
  return this.callSendApi(message_props, options);
}

function sendAttachment (options) {
  if (!options.attachment) {
    console.error('"attachment" property required')
    return
  }
  
  let message_props = {
    'attachment': options.attachment
  };

  return this.callSendApi(message_props, options);
}

function sendTemplate (options) {
  let payload;
  let message_props = {
    'attachment': {
      'type': 'template'
    }
  };

  if (!options.template_type) {
    console.error('Valid "template_type" property required');  
    return;
  }

  switch (options.template_type) {
    case 'generic':
      message_props.attachment.payload = new GenericTemplate(options);
      break;

    case 'list':
      message_props.attachment.payload = new ListTemplate(options);
      break;

    case 'button':
      message_props.attachment.payload = new ButtonTemplate(options);
      break;

    case 'media':
      message_props.attachment.payload = new MediaTemplate(options);
      break;

    case 'open_graph':
      message_props.attachment.payload = new OpenGraphTemplate(options);
      break;

    case 'receipt':
      message_props.attachment.payload = new ReceiptTemplate(options);
      break;

    case 'airline_boarding_pass':
      message_props.attachment.payload = new AirlineBoardingPassTemplate(options);
      break;

    case 'airline_itinerary':
      message_props.attachment.payload = new AirlineItineraryTemplate(options);
      break;

    case 'airline_checkin':
      message_props.attachment.payload = new AirlineCheckinTemplate(options);
      break;

    case 'airline_flight_update':
      message_props.attachment.payload = new AirlineFlightUpdateTemplate(options);
      break;

    default: 
      console.error('Invalid "template_type"')    ;
      return;
  }

  return this.callSendApi(message_props, options)

}


function sendSenderAction (options) {

}

/* TEMPLATE CONSTRUCTORS */
function GenericTemplate (options) {
  let required_props = ['elements'];
  let template_properties = parseTemplateProperties(options, required_props);
  this.template_type = 'generic';
  for (let name in template_properties) {
    this[name] = template_properties[name];
  }
}

function MediaTemplate (options) {
  let required_props = ['elements'];
  let template_properties = parseTemplateProperties(options, required_props);
  this.template_type = 'media';
  for (let name in template_properties) {
    this[name] = template_properties[name];
  }
}

function ListTemplate (options) {
  let required_props = ['elements'];
  let optional_props = ['button', 'top_element_style'];
  let template_properties = parseTemplateProperties(options, required_props, optional_props);
  
  this.template_type = 'list';
  for (let name in template_properties) {
    this[name] = template_properties[name];
  }
  
}

function ButtonTemplate (options) {
  let required_props = ['buttons', 'text'];
  let template_properties = parseTemplateProperties(options, required_props);

  this.template_type = 'button';
  for (let name in template_properties) {
    this[name] = template_properties[name];
  }
}

function OpenGraphTemplate (options) {  
  let required_props = ['elements'];
  let template_properties = parseTemplateProperties(options, required_props);
  this.template_type = 'open_graph';
  for (let name in template_properties) {
    this[name] = template_properties[name];
  }
}

function ReceiptTemplate (options) {
  let required_props = [
    'recipient_name',
    'order_number',
    'currency',
    'payment_method',
    'summary'
  ]

  let optional_props = [
    'sharable',
    'merchant_name',
    'timestamp',
    'elements',
    'address',
    'adjustments'
  ]
  let template_properties = parseTemplateProperties(options, required_props, optional_props);

  this.template_type = 'receipt';
  
  for (let name in template_properties) {
    this[name] = template_properties[name];
  }
  
}


function AirlineBoardingPassTemplate (options) {
  this.template_type = '';
}

function AirlineItineraryTemplate (options) {
  this.template_type = '';
}

function AirlineCheckinTemplate (options) {
  this.template_type = '';
}

function AirlineFlightUpdateTemplate (options) {
  this.template_type = '';
}

function parseTemplateProperties (options, required_props, optional_props) {
  let properties = {};
  required_props.forEach(prop => {
    if (options[prop]) {
      console.error(`Valid ${prop} property required`);     
      return;
    }
    properties[prop] = options[prop];
  });

  if (optional_props) {
    optional_props.forEach(prop => {
      if (options[prop]) properties[prop] = options[prop];
    })
  }

  return properties;
}

module.exports = {
  sendQuickReplies,
  sendText,
  sendAttachment,
  sendTemplate,
  sendSenderAction,
  callSendApi
}