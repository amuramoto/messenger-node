function MessagingInsights (GraphRequest) {
  this.getMessagingInsights = getMessagingInsights.bind(GraphRequest);
}

/**
 * Retrieves metrics from the Messaging Insights API.
 * @param  {Object}  options An object that describes the metrics data to retrieve.
 * @param  {Array<String>}  options.metrics  An array list of the metrics to retrieve.
 * @param  {String}  options.since  _Optional._ UNIX timestamp of the start time to get the metric for.
 * @param  {String}  options.until  _Optional._ UNIX timestamp of the end time to get the metric for.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let today = new Date().getTime();
 * let options = {
 *   'metrics': [
 *     'page_messages_active_threads_unique',
 *     'page_messages_blocked_conversations_unique',
 *     'page_messages_reported_conversations_unique',
 *     'page_messages_reported_conversations_by_report_type_unique'
 *   ],
 *   'since': today - 864000,
 *   'until': today
 * };
 * Client.getMessagingInsights(options)
 *   .then(res => {
 *     console.log(res);
 *     // { 
 *     //   "data": [ 
 *     //     { 
 *     //       "name": "<METRIC>", 
 *     //       "period": "day", 
 *     //       "values": [ 
 *     //         { 
 *     //           "value": "<VALUE>", 
 *     //           "end_time": "<UTC_TIMESTAMP>" 
 *     //         }, 
 *     //         { 
 *     //           "value": "<VALUE>", 
 *     //           "end_time": "<UTC_TIMESTAMP>" 
 *     //         }
 *     //      ]
 *     //     } 
 *     //   ],
 *     // } 
 *   });
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
      ];
    }

    let request_options = {
      'path': '/me/insights',
      'qs': {'metric': options.metrics.join(',')}
    };

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
