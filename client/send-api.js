const payload = {};

function QuickReplies (options) {
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
    console.error('"text" or "attachment" required');
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

function TextMessage (options) {

}

function Attachment (options) {

}

function Template (type, options) {

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

function SenderAction (options) {

}