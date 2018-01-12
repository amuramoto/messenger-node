function MessagingInsights (GraphRequest) {
  this.getMessagingInsights = getMessagingInsights.bind(GraphRequest);
}

/**
 * Retrieves metrics from the Messaging Insights API
 * @param  {Object}  options
 * @param  {String}  options.metrics
 * @param  {String}  options.since
 * @param  {String}  options.until
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 */
function getMessagingInsights(options) {
  return new Promise (async (resolve, reject) => {
    let metrics = options.metrics;

    if (metrics && !Array.isArray(metrics)) {
      reject('metrics must be an array');
    }

    if (!metrics) {
      metrics = [
        'page_messages_active_threads_unique',
        'page_messages_blocked_conversations_unique',
        'page_messages_reported_conversations_unique',
        'page_messages_reported_conversations_by_report_type_unique'
      ]
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
