function SponsoredMessage (GraphRequest) {
  this.sendSponsoredMessage = sendSponsoredMessage.bind(GraphRequest)
}

/**
 * Sends a new Sponsored Message
 * @param   {Integer}  ad_account_id
 * @param   {Object}   options
 * @param   {String}   options.message_creative_id
 * @param   {String}   options.daily_budget
 * @param   {String}   options.bid_amount
 * @param   {String}   options.targeting
 * @return  {Promise<Object>}  The API response
 * @function  Client.sendSponsoredMessage
 * @memberof SendMessages#
 */
function sendSponsoredMessage (ad_account_id, options) {
  return new Promise (async (resolve, reject) => {
    let required = [
      'message_creative_id',
      'daily_budget',
      'bid_amount',
      'targeting'
    ]

    let request_options = {};

    required.forEach(prop => {
      if (!options[prop]) {
        reject('Valid ' + prop + ' property required');        
      }
    });

    if (!ad_account_id) reject('ad_account_id required');

    options.access_token = this.getPageToken();    

    request_options.path = '/act_' + ad_account_id + '/sponsored_message_ads';
    request_options.api_version = 'v2.11';
    request_options.formData = options;
    
    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = SponsoredMessage;