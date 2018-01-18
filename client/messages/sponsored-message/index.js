function SponsoredMessage (GraphRequest) {
  this.sendSponsoredMessage = sendSponsoredMessage.bind(GraphRequest);
}

/**
 * Sends a new Sponsored Message.
 * @param   {Integer}  ad_account_id  Your Facebook Ads account ID.
 * @param   {Object}   options  An object that describes the sponsored message to send.
 * @param   {String}   options.message_creative_id  The ID of a message creative to send. Created by calling {@link #createmessagecreative|Client.createMessageCreative()}.
 * @param   {String}   options.daily_budget  The maximum daily budget of the ad campaign for the Sponsored Message send.
 * @param   {String}   options.bid_amount  The maximum bid for each message recipient.
 * @param   {String}   options.targeting  {@link https://developers.facebook.com/docs/marketing-api/targeting-specs|Targeting spec} for the Sponsored Message send.
 * @return  {Promise<Object>}  The API response
 * @memberof  Client#
 */
function sendSponsoredMessage (ad_account_id, options) {
  return new Promise (async (resolve, reject) => {
    let required = [
      'message_creative_id',
      'daily_budget',
      'bid_amount',
      'targeting'
    ];

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