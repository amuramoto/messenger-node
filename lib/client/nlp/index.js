function NLP (GraphRequest) {
  this.setNlpConfigs = setNlpConfigs.bind(GraphRequest);
}

/**
 * Sets config values for [built-in NLP](https://developers.facebook.com/docs/messenger-platform/built-in-nlp.
 * @param {Object} configs The NLP configs to set
 * @return {String} configs.nlp_enabled  Enable/disable built-in NLP. Must be `true` or `false`
 * @return {String} configs.model  The default NLP model to use. For values, see the [Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/built-in-nlp#api).
 * @return {String} configs.custom_token  [Wit.ai](https://wit.ai/) server token for integrating a custom model.
 * @return {String} configs.verbose  Enables verbose mode, which returns extra information like the position of the detected entity in the query. Must be `true` or `false`.
 * @return {String} configs.n_best  The number of entities to return, in descending order of confidence. Minimum 1. Maximum 8.
 * @memberof Client#
 * @example
 * let configs = {
 *   'nlp_enabled': true,
 *   'model': 'ENGLISH',
 *   'custom_token': '924t2904t7304ty3wo',
 *   'verbose': true,
 *   'n_best': 2
 * }
 * Client.setNlpConfigs(configs).then(res => {
 *  .then(res => {
 *     console.log(res) // { 'success': true }
 *  });
 */
function setNlpConfigs (configs) {  
  return new Promise (async (resolve, reject) => {
    let request_options = {
      'path': '/me/nlp_configs',
      'method': 'POST',
      'qs': {}
    };
    for (name in configs) {
      request_options.qs[name] = configs[name];
    }
    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = NLP;