function parseProperties (options, required_props, optional_props) {
  let properties = {
    'template_type': options.template_type
  };
  required_props.forEach(prop => {
    if (!options[prop]) {
      console.error(`Valid ${prop} property required`);     
      return;
    }
    properties[prop] = options[prop];
  });

  if (optional_props) {
    optional_props.forEach(prop => {
      if (options[prop]) properties[prop] = options[prop];
    });
  }

  return properties;
}

function getProperties (options) {
  let required_props;
  let optional_props;
  if (!options.template_type) {
    console.error('Valid "template_type" property required');  
    return;
  }

  switch (options.template_type) {
    case 'generic':      
      required_props = ['elements'];
      break;      

    case 'list':      
      required_props = ['elements'];
      optional_props = ['button', 'top_element_style'];
      break;

    case 'button':
      required_props = ['buttons', 'text'];
      break;

    case 'media':
      required_props = ['elements'];
      break;

    case 'open_graph':
      required_props = ['elements'];
      break;

    case 'receipt':
      required_props = [
        'recipient_name',
        'order_number',
        'currency',
        'payment_method',
        'summary'
      ];

      optional_props = [
        'sharable',
        'merchant_name',
        'timestamp',
        'elements',
        'address',
        'adjustments'
      ];
      break;

    case 'airline_boardingpass':
      required_props = [
        'intro_message',
        'locale',
        'boarding_pass'
      ];

      optional_props = [
        'theme_color'
      ];
      break;

    case 'airline_itinerary':
      required_props = [
        'intro_message',
        'locale',
        'pnr_number',
        'passenger_info',
        'flight_info',
        'passenger_segment_info',
        'total_price',
        'currency'
      ];

      optional_props = [
        'theme_color',
        'price_info',
        'base_price',
        'tax'
      ];
      break;

    case 'airline_checkin':
      required_props = [
        'intro_message',
        'locale',
        'checkin_url',
        'flight_info'
      ];

      optional_props = [
        'pnr_number'
      ];
      break;

    case 'airline_update':
      required_props = [
        'intro_message',
        'update_type',
        'locale',
        'update_flight_info'
      ];

      optional_props = [
        'theme_color',
        'pnr_number'
      ];
      break;

    default: 
      console.error('Invalid "template_type"')    ;
      return;
  }

  return parseProperties(options, required_props, optional_props);  
}

module.exports = {
  getProperties
};