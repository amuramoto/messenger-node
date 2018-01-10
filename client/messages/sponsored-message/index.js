function SponsoredMessage (GraphRequest) {
  this.sendSponsoredMessage = sendSponsoredMessage.bind(GraphRequest)
}

function sendSponsoredMessage (options) {
  return new Promise (async (resolve, reject) => {
    let required = [
      'message_creative_id',
      'daily_budget',
      'bid_amount',
      'targeting',
      'ad_account_id'
    ]

    required.forEach(prop => {
      if (!options[prop]) {
        reject('Valid ' + prop + ' property required');        
      }
    })

    options.access_token = this.getPageToken();
    options.path = '/act_' + options.ad_account_id + '/sponsored_message_ads';
    options.api_version = 'v2.11';

    delete options.ad_account_id;
    
    try {
      let response = await this.sendGraphRequest({'formData': options});
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = SponsoredMessage;