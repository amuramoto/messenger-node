function NLP (GraphRequest) {
  this.setNlpConfigs = setNlpConfigs.bind(GraphRequest);
}

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