function MessagingInsights (GraphRequest) {
  this.get = get.bind(GraphRequest);
}

function get(options) {
  if (!options.metrics) {
    console.error('Valid metrics array required');
    return;
  }

  let request_options = {
    'path': '/me/insights',
    'qs': {'metric': options.metrics.join(',')}
  }

  if (options.since) request_options.qs.since = options.since;
  if (options.until) request_options.qs.until = options.until;

  return this.sendGraphRequest(request_options);
}

module.exports = MessagingInsights;
