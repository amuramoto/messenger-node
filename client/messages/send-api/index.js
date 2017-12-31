const util = require('./util'),
      payload = {};

function sendText (options) {
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Options object required');
    }

    if (!options.text) {
      reject('"text" property required');
    }
    let response = await this.callSendApi(options);
    resolve(response);
  });
}

function sendQuickReplies (options) {  
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Options object required');    
    }

    if (!options.quick_replies) {
      reject('"quick_replies" property required');    
    }

    let response = await this.callSendApi(options);
    resolve(response);
  });
}

function sendAttachment (options) {
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Options object required');      
    }

    if (!options.attachment) {
      reject('"attachment" property required');      
    }
    
    let response = this.callSendApi(options);
    resolve(response);
  });
}

function sendTemplate (options) {
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Options object required');
      return;
    }

    let response = this.callSendApi(options);
    resolve(response);
  });
}

function sendSenderAction (options) {
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Options object required');      
    }

    let response = this.callSendApi(options);
    resolve(response);
  });
}

/* API Request */
function callSendApi (options) {  
  return new Promise (async (resolve, reject) => {
    if (!options) {
      reject('Message properties and options object required');      
    }

    let request_options = {
      'path': '/me/messages',
      'payload': new util.RequestPayload(options)
    }
    
    let message_props = util.parseMessageProps(options);
    
    Object.assign(request_options.payload.message, message_props);
    
    let response = await this.send(request_options);  
    resolve(response);
  });
}

module.exports = {
  sendQuickReplies,
  sendText,
  sendAttachment,
  sendTemplate,
  sendSenderAction,
  callSendApi  
};