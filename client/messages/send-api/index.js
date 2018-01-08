const util = require('./util'),
      payload = {};

function sendText (recipient, text) {
  return new Promise (async (resolve, reject) => {
    if (!text) {
      reject('text required');
    }
    
    let payload = {'text': text};

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function sendQuickReplies (recipient, quick_replies, text) {  
  return new Promise (async (resolve, reject) => {
    if (!quick_replies || !Array.isArray(quick_replies)) {
      reject('quick_replies array required');    
    }

    let payload = {
      'quick_replies': quick_replies
    }

    if (text) payload.text = text;

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function sendAttachment (recipient, attachment) {
  return new Promise (async (resolve, reject) => {
    if (!attachment) {
      reject('attachment object required');      
    }
    
    let payload = {
      'attachment': attachment
    }

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function sendTemplate (recipient, template) {
  return new Promise (async (resolve, reject) => {
    if (!template) {
      reject('template object required');
      return;
    }

    let payload = template;

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function sendSenderAction (recipient, sender_action) {
  return new Promise (async (resolve, reject) => {
    if (!sender_action) {
      reject('sender_action required');      
    }

    let payload = {
      'sender_action': sender_action
    }

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/* API Request */
function callSendApi (recipient, payload) {  
  return new Promise (async (resolve, reject) => {
    if (!recipient) {
      reject('recipient object required');
    }

    if (!payload) {
      reject('payload required');      
    }

    let request_options = {
      'path': '/me/messages',
      'payload': new util.RequestPayload(recipient, payload)
    }

    try {    
      let response = await this.send(request_options);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
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