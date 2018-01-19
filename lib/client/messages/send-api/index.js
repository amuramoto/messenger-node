const util = require('./util');

function SendAPI (GraphRequest) {
  this.sendQuickReplies = sendQuickReplies;
  this.sendText = sendText;
  this.sendAttachment = sendAttachment;
  this.sendTemplate = sendTemplate;
  this.sendSenderAction = sendSenderAction;
  this.callSendApi = callSendApi.bind(GraphRequest);
}

/**
 * Sends a text message.
 * @param  {Object}  recipient  An object that describes the message recipient in the format: `{<id_type>: <id>}`.
 * For example, sends to a PSID would be `{'id': 123456}`, to a phone number `{'phone_number': '+1 (408) 444-4444'}.
 * @param  {String}  text  The text to send.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let recipient = {'id': '57024957309673'},
 *     text = 'This is a text message';
 * Client.sendText(text)
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //   "recipient_id": "1008372609250235", 
 *     //   "message_id": "mid.1456970487936:c34767dfe57ee6e339"
 *     // }
 *   });
 */
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

/**
 * Sends a set of quick reply buttons
 * @param  {Object}  recipient  An object that describes the message recipient in the format: `{<id_type>: <id>}`.
 * For example, sends to a PSID would be `{'id': 123456}`, to a phone number `{'phone_number': '+1 (408) 444-4444'}.
 * @param  {Object}  quick_replies  An object that describes the quick replies to send.
 * @param  {String}  text   _Optional._ Text message to send with quick replies.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example <caption>Generic Template</caption> 
 * let recipient = {'id': '57024957309673'};
 * let quick_replies = [
 *   {
 *     'content_type':'text',
 *     'title':'Quick Reply 1',
 *     'image_url':'https://www.example.com/icon.png',
 *     'payload':'quick_reply_payload'
 *   },
 *   {
 *     'content_type':'location'
 *   }
 * ];
 * let text = 'Text message to send with the quick replies'; //optional
 * Client.sendQuickReplies(recipient, quick_replies, text)
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //   "recipient_id": "1008372609250235", 
 *     //   "message_id": "mid.1456970487936:c34767dfe57ee6e339"
 *     // }
 *   });
 */
function sendQuickReplies (recipient, quick_replies, text) {  
  return new Promise (async (resolve, reject) => {
    if (!quick_replies || !Array.isArray(quick_replies)) {
      reject('quick_replies array required');    
    }

    let payload = {
      'quick_replies': quick_replies
    };

    if (text) payload.text = text;

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Sends a standalone attachment, including images, audio, video, and files.
 * @param  {Object}  recipient  An object that describes the message recipient in the format: `{<id_type>: <id>}`.
 * For example, sends to a PSID would be `{'id': 123456}`, to a phone number `{'phone_number': '+1 (408) 444-4444'}.
 * @param  {Object}  attachment  An object that describes the attachment to send.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let recipient = {'id': '57024957309673'},
 *     options = {
 *       'type':'image', 
*        'url':'https://www.example.com/dog.png', 
*        'is_reusable':true           
 *     }
 * Client.sendAttachment(recipient, options)
 *   .then(res => {
 *     console.log(res); // {"id": "9485676932424"}
 *     // {
 *     //   "recipient_id": "1008372609250235", 
 *     //   "message_id": "mid.1456970487936:c34767dfe57ee6e339",
 *     //   "attachment_id": "395723096739076353"
 *     // }
 *   });
 *   });
 */
function sendAttachment (recipient, attachment) {
  return new Promise (async (resolve, reject) => {
    if (!attachment) {
      reject('attachment object required');      
    }
    
    let payload = new util.AttachmentPayload(recipient, attachment);
    
    if (!payload) reject('URL or file required');
    
    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Sends a template message.
 * @param  {Object}  recipient  An object that describes the message recipient in the format: `{<id_type>: <id>}`.
 * For example, sends to a PSID would be `{'id': 123456}`, to a phone number `{'phone_number': '+1 (408) 444-4444'}.
 * @param  {Object}  template  An object that describes the template to send.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example <caption>Generic Template</caption> 
 * let recipient = {'id': '57024957309673'};
 * let message = {
 *   template_type: 'generic',
 *   elements: [
 *     {
 *       'title':'This is a generic template',
 *       'subtitle':'Plus a subtitle!',
 *       'image_url':'https://www.example.com/dog.jpg',
 *       'buttons':[
 *         {
 *           'type':'postback',
 *           'title':'Postback Button',
 *           'payload':'postback_payload'
 *         },
 *         {
 *           'type': 'web_url',
 *           'title': 'URL Button',
 *           'url': 'https://www.example.com/'
 *         }
 *       ]      
 *     }
 *   ]
 * };
 * Client.sendTemplate(message)
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //   "recipient_id": "1008372609250235", 
 *     //   "message_id": "mid.1456970487936:c34767dfe57ee6e339"
 *     // }
 *   });
 * @example <caption>Media Template</caption> 
 * let recipient = {'id': '57024957309673'};
 * let message = {
 *   'template_type': 'media',
 *   'elements': [
 *     {
 *       'media_type': 'image',
 *       'url': 'https://www.example.com/dog.jpg'
 *     },
 *     'buttons':[
 *       {
 *         'type': 'web_url',
 *         'title': 'URL Button',
 *         'url': 'https://www.example.com/'
 *       }
 *     ]    
 *   ]
 * };
 * Client.sendTemplate(message)
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //   "recipient_id": "1008372609250235", 
 *     //   "message_id": "mid.1456970487936:c34767dfe57ee6e339"
 *     // }
 *   });
 */
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

/**
 * Sends a sender action.
 * @param  {Object}  recipient  An object that describes the message recipient in the format: `{<id_type>: <id>}`.
 * For example, sends to a PSID would be `{'id': 123456}`, to a phone number `{'phone_number': '+1 (408) 444-4444'}.
 * @param  {String}  sender_action  The sender action to send. Must be `typing_on`, `typing_off`, or `mark_seen`.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * let recipient = {'id': '57024957309673'},
 *     sender_action = 'mark_seen';
 * Client.sendSenderAction(recipient, sender_action)
 *   .then(res => {
 *     console.log(res); // {"recipient_id": "1008372609250235"}
 *   });
 */
function sendSenderAction (recipient, sender_action) {
  return new Promise (async (resolve, reject) => {
    if (!sender_action) {
      reject('sender_action required');      
    }

    let payload = {
      'sender_action': sender_action
    };

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

    let request_options = { 'path': '/me/messages' };

    if (payload.formData) {
      request_options.formData = payload.formData;
    } else {
      request_options.payload = new util.RequestPayload(recipient, payload);  
      if (!request_options.payload) reject('error creating request payload');      
    }
    
    try {    
      let response = await this.sendGraphRequest(request_options);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = SendAPI;