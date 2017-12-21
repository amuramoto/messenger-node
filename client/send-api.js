const payload = {},
      platform = require('./platform');

function SendApiPayload (options) {
  if (!options.recipient || !options.recipient.id || !options.recipient.type) {
    console.error('Invalid message recipient');
    return;
  }

  if (!options.messaging_type && new Date().getTime() >= 1525676400000) {
    console.error('messaging_type required');
    return;
  } else if (options.messaging_type) {
    this.messaging_type = options.messaging_type;   
  }

  this.message = {};
  this.recipient = {};
  this.recipient[options.recipient.type] = options.recipient.id;
  
}

function sendQuickReplies (options) {  
  if (typeof options.quick_replies !== 'Array' || options.quick_replies.length === 0) {

    let error = '"quick_replies" must be a non-empty array';

    for (let qr of quick_replies) {
      if (typeof qr !== 'Object') {
        error += ' of Objects';
        break;
      }
    }
    console.error(error);
    return;
  }

  if (!options.content_type) {
    console.error('"content_type" required');
    return;
  }

  if (['text', 'location'].indexOf(options.content_type) == -1) {
    console.error('Invalid "content_type"');
    return;
  }

  if (!options.text && !options.attachment) {
    console.error('"text" or "attachment" property required');
    return;
  }

  if (options.content_type === 'text') {
    let error = ' required when "content_type" is "text"';
    if (!options.title) {
      console.error('"title"' + error);      
    } else if (!options.payload) {
      console.error('"payload"' + error);      
    }
    return; 
  }
}

function sendText (options, callback) {

  let payload = new SendApiPayload(options);

  if (!options.text) {
    console.error('"text" property required')
    return;
  }

  payload.message.text = options.text;

  return this.send('/messages', payload);

}

function sendAttachment (options) {
  if (!options.attachment) {
    console.error('"attachment" property required')
    return
  }
  if (!options.attachment.type || !options.attachment.payload) {
    console.error('"type" and "payload" properties required')
    return 
  }
}

function sendTemplate (type, options) {

}


function sendSenderAction (options) {

}




function GenericTemplate (options) {

}

function MediaTemplate (options) {

}

function ListTemplate (options) {

}

function ButtonTemplate (options) {

}

function OpenGraphTemplate (options) {

}

function ReceiptTemplate (options) {

}

function AirlineBoardingPassTemplate (options) {

}

function AirlineItineraryTemplate (options) {

}

function AirlineCheckinTemplate (options) {

}

function AirlineFlightUpdateTemplate (options) {

}

module.exports = {
  sendQuickReplies,
  sendText,
  sendAttachment,
  sendTemplate,
  sendSenderAction
}