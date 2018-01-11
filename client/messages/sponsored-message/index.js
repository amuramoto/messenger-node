function SponsoredMessage (GraphRequest) {
  this.sendSponsoredMessage = sendSponsoredMessage.bind(GraphRequest)
}

function sendSponsoredMessage (ad_account_id, formData) {
  return new Promise (async (resolve, reject) => {
    let required = [
      'message_creative_id',
      'daily_budget',
      'bid_amount',
      'targeting'
    ]

    let request_options = {};

    required.forEach(prop => {
      if (!formData[prop]) {
        reject('Valid ' + prop + ' property required');        
      }
    });

    if (!ad_account_id) reject('ad_account_id required');

    formData.access_token = this.getPageToken();    

    request_options.path = '/act_' + ad_account_id + '/sponsored_message_ads';
    request_options.api_version = 'v2.11';
    request_options.formData = formData;
    
    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = SponsoredMessage;