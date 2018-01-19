function MessengerCode (GraphRequest) {
  this.generateMessengerCode = generateMessengerCode.bind(GraphRequest);
}

/**
 * Generate a new static or parametric [Messenger Code](https://developers.facebook.com/docs/messenger-platform/reference/messenger-code-api) for your bot.
 * @param  {Object}   options  An object that describes the Messenger Code to generate.
 * @param  {Integer}  options.ref  The ref string to pass to your bot is opened via the code. Max 250 characters. Valid characters: `a-z A-Z 0-9 +/=-.:_`.
 * @param  {Object}   options.image_size  The size, in pixels, for the image you are requesting. Supported range: 100-2000. Defaults to 1000.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let options = {
 *   'ref': 'referral_ref', //optional
 *   'image_size': 500 //optional
 * };
 * Client.generateMessengerCode(options)
 *   .then(res => {
 *     console.log(res); // {"uri": "https://scontent.xx.fbcdn.net/v/t39..."}
 *   });
 */
function generateMessengerCode(options) {
  return new Promise (async (resolve, reject) => {
    let request_options = {
      'path': '/me/messenger_codes',
      'payload': {
        'type': 'standard'
      }
    };

    if (options.ref) request_options.payload.data = {'ref': options.ref};
    if (options.image_size) {
      if (options.image_size < 100 || options.image_size > 2000) {
        reject('image_size must be between 100-2000.');        
      }
      request_options.payload.image_size = options.image_size;
    }

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }    
  });
}

module.exports = MessengerCode;
