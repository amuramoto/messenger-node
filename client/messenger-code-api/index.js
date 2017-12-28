function MessengerCode (GraphRequest) {
  this.generate = generate.bind(GraphRequest);
}

function generate(options) {
  let request_options = {
    'path': '/me/messenger_codes',
    'payload': {
      'type': 'standard'
    }
  }

  if (options.ref) request_options.payload.data = {'ref': options.ref};
  if (options.image_size) {
    if (options.image_size < 100 || options.image_size > 2000) {
      console.error('image_size must be between 100-2000.')
      return;
    }
    request_options.payload.image_size = options.image_size;
  }

  return this.sendGraphRequest(request_options);
}

module.exports = MessengerCode;
