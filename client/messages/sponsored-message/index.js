// function SponsoredMessage (GraphRequest) {
//   this.send = send.bind(GraphRequest);
// }

function sendSponsoredMessage (options) {
  let required = [
    'message_creative_id',
    'daily_budget',
    'bid_amount',
    'targeting',
    'ad_account_id'
  ]

  required.forEach(prop => {
    if (!options[prop]) {
      console.error('Valid ' + prop + ' property required');
      return;
    }
  })

  options.access_token = this.getPageToken();
  options.path = '/act_' + options.ad_account_id + '/sponsored_message_ads';
  options.api_version = 'v2.11';

  delete options.ad_account_id;

  this.sendGraphRequest({'formData': options});
}

module.exports = {
  sendSponsoredMessage
}