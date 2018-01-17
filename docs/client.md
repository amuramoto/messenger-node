## Creating a `Client` Instance

To make API calls, start by creating an instance of the `Client` class. The following configuration properties may be provided when the `Client` instance is created: 

- `page_token`: __Required__. A valid Page-scope access token for the Page associated with your bot. This will be sent with almost every API request.
- `app_token`: _Optional._ A valid app-scoped access token. This is only used for certain calls to the Platform's [ID Matching API](https://developers.facebook.com/docs/messenger-platform/identity/id-matching).
- `api_version`: _Optional._ The version of the Graph API to target for all API requests in the format `v2.11`. Defaults to the latests version of the Graph API.

```js
let client_config = {
  'page_token': 'EAAYcRUPT1JNby4BSexAmPMuy3QBAGYBAorwzZC7FnQZBZBkFZAOZAF9CBQzt6qsdCwg',
  'app_token': 'qsdT1JNby4BSexAmPMuy3QBAGYBAorwzZC7FnQZBZBEAAYcRUPFkFZAOZACwg9CBQzt6',
  'api_version': 'v2.11'
}

const Client = new Messenger.Client(client_config);
```

## Making API Calls

All Messenger Platform API requests are included as instance functions that are called on the `Client` instance. Here are a few examples. For a complete list, see the [`Client` reference](#client) below. 

### Send a Text Message

```js
// define the message recipient
let recipient = {
  'id': '1234556'
};

// set the message to send
let text = 'This is my amazing text message?!'

// send the text message
Client.sendText(recipient, text)
  .then(res => {
    // log the api response
    console.log(res);
  });
  .catch(e) {
    console.error(e);
  }
```

### Send a Generic Template Message

```js
// define the message recipient
let recipient = {
  'id': '1234556'
};

// define the generic template
let generic_template = {
  template_type: 'generic',
  elements: [
    {
      'title':'This is a generic template',
      'subtitle':'Plus a subtitle!',
      'buttons':[
        {
        'type':'postback',
        'title':'Postback Button',
        'payload':'postback_payload'
        },
        {
        'type': 'web_url',
        'title': 'URL Button',
        'url': 'https://messenger.fb.com/'
        }
      ]      
    }
  ]
}

// send the template
Client.sendTemplate(recipient, generic_template)
  .then(res => {
    // log the api response
    console.log(res);
  });
  .catch(e) {
    console.error(e);
  }
```

### Get a User's Profile

```js
// PSID of the user
let psid = '12345324'

// profile fields to retrieve
let fields = ['id', 'first_name', 'last_name', 'profile_pic']

Client.getUserProfile(psid, fields)
  .then(res => {
    // log the api response
    console.log(res);
  });
  .catch(e) {
    console.error(e);
  }
```

## API Responses & Error Handling

All SDK functions return a promise that resolves with the full API response received from the Messenger Platform on success, and rejects with an error string on failure. Functions also do light input-checking when called, and will reject if incorrect arguments are provided.

The SDK does not transform the API response in any way, other than ensuring you get back a JSON object.