# Messenger Platform Node.js SDK

The `messenger-node` module is a server-side SDK for building bots on Facebook's [Messenger Platform](https://developers.facebook.com/docs/messenger-platform/). The SDK includes two base classes:

- [Webhook](#webhook): Creates an [express.js](expressjs.com) web server for receiving and processing [webhook events](https://developers.facebook.com/docs/messenger-platform/webhook) sent by the Messenger Platform.
- [Client](#creating-a-client-instance): Creates a client object that simplifies sending requests to the Messenger Platform's various APIs.

## Importing the SDK

To use the SDK, start by importing it into your project:

```js
const Messenger = require('messenger-node');
```

Once the SDK is imported, you can create instances of the `Webhook` and `Client` classes.## Webhook

Every Messenger bot has to have a webhook that the Messenger Platform can send [webhook events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/) to. This SDK provides a simple `Webhook` class that you can instantiate to create and run a fully-functional webhook. The webhook can do all these things for you:

- Handle the webhook verification request sent by the Messenger Platform when you register your webhook. 
- Parse all incoming webhook events, and emit them for you to react to with event listeners.
- Validate signed requests from the Messenger Extensions SDK [`getContext()`](https://developers.facebook.com/docs/messenger-platform/webview/context) function.

Basically it saves you the hassle of writing the basic stuff so you can get to building your bot right away.

### Creating a Webhook

To create a webhook, start by creating an instance of the `Webhook` class. The following configuration properties may be provided when the `Webhook` instance is created: 

- `verify_token`: __Required.__ The token to use for webhook verification. The Messenger Platform will send this with the challenge request when you register your webhook.
- `port`: _Optional._ The port number your webhook should listen on. Defaults to the `process.env.PORT`.
- `endpoint`: _Optional._ The endpoint for your webhook. For example, if your webhook base URL is `https://www.mywebhook.com` and `endpoint` is set to `bananas`, the full URL that you should tell the Messenger Platform to send webhook events to is `https://www.mywebhook.com/bananas/`. Defaults to `webhook`
- `app_secret`: _Optional._ Your app secret. This is required if you want to validate signed webview requests using [Webhook.validateSignedRequest()](#validatesignedrequest).

```js
let webhook_config = {
  'verify_token':'MY_VERIFY_TOKEN'
}

const Webhook = new Messenger.Webhook(webhook_config);
```

### Handling Webhook Events

When the Messenger Platform sends your webhook a [webhook event](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/) the SDK will emit it by name, and include info about the sender and the full body of the received event.

For a list of available webhook events, see the [list in the Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/).

To listen for a particular event, all you have to do is add an event listener with [`Webhook.on`](#on) or `[Webhook.once`](#once):

```js
Webhook.on('messaging_postbacks', (event_type, sender_info, webhook_event) => {
  // do something
});
```

You can also [`Webhook.emit`](#emit) events, which can be useful for testing:

```js
Webhook.emit('messaging_postbacks', event_type, sender_info, webhook_event);
```

#### Callback Arguments
| **Name** | **Type** | **Description** | **Example** |
|------|------|-------------|--------|
| event_type | Object | Contains the event type and subtype. If the webhook has no subtype, then `event_type.subtype` will be `null` | `{'type': 'messaging_handovers', 'subtype': 'pass_thread_control}` |
| sender_info | Object | Contains the ID and ID type. | `{'id': '84736289974242', 'type': 'PSID'}` |
| webhook_event | Object | The complete webhook event parsed from the `messaging` array of the received `POST` request. | For webhook event formats and details, see the [webhook event reference](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/) in the Messenger Platform docs. |## Client

Once you have a working webhook, you need a way to respond to the events and messages your bot receievs. This means you need to be able to send allllll kiiinnndddsss of API requests to the Messenger Platform. The `Client` provided by this SDK makes this a much simpler declarative process by handling all the repetitive (and error prone) parts of formatting valid API requests for you, and making sure they get sent to the right place.

### Creating a `Client` Instance

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

### Making API Calls

All Messenger Platform API requests are included as instance functions that are called on the `Client` instance. Here are a few examples. For a complete list, see the [`Client` reference](#client) below. 

#### Send a Text Message

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

#### Send a Generic Template Message

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

#### Get a User's Profile

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

### API Responses & Error Handling

All SDK functions return a promise that resolves with the full API response received from the Messenger Platform on success, and rejects with an error string on failure. Functions also do light input-checking when called, and will reject if incorrect arguments are provided.

The SDK does not transform the API response in any way, other than ensuring you get back a JSON object.