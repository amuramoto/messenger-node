function MessagingInsights (GraphRequest) {
  this.get = get.bind(GraphRequest);
}

function get(metrics) {
  if (!metrics) {
    console.error('Valid metrics array required');
    return;
  }

  let request_options = {
    'path': '/me/insights',
    'qs': {'metric': metrics.join(',')}
  }


  return this.sendGraphRequest(request_options);
}

module.exports = MessagingInsights;
