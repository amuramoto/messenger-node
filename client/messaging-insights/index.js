function MessagingInsights (GraphRequest) {
  this.get = get.bind(GraphRequest);
}

function get(options) {
  return new Promise (async (resolve, reject) => {
    if (!options.metrics) {
      reject('Valid metrics array required');      
    }

    let request_options = {
      'path': '/me/insights',
      'qs': {'metric': options.metrics.join(',')}
    }

    if (options.since) request_options.qs.since = options.since;
    if (options.until) request_options.qs.until = options.until;

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }    
  });
}

module.exports = MessagingInsights;
