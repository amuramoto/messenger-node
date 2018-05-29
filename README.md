# Messenger Platform Node.js SDK

[![NSP Status](https://nodesecurity.io/orgs/alex/projects/fe10e5f2-44d9-472f-924b-4615aa9c98bb/badge)](https://nodesecurity.io/orgs/alex/projects/fe10e5f2-44d9-472f-924b-4615aa9c98bb)  [![Build Status](https://travis-ci.org/amuramoto/messenger-node.svg?branch=master)](https://travis-ci.org/amuramoto/messenger-node)

The `messenger-node` module is a server-side SDK for building bots on Facebook's [Messenger Platform](https://developers.facebook.com/docs/messenger-platform/). The SDK includes two base classes:

- [Webhook](#webhook): Creates an [express.js](expressjs.com) web server for receiving and processing [webhook events](https://developers.facebook.com/docs/messenger-platform/webhook) sent by the Messenger Platform.
- [Client](#creating-a-client-instance): Creates a client object that simplifies sending requests to the Messenger Platform's various APIs.

## Installing the SDK

The SDK is available via [NPM](https://www.npmjs.com/package/messenger-node):

```
npm install messenger-node --save
```


## Importing the SDK

To use the SDK, start by importing it into your project:

```js
const Messenger = require('messenger-node');
```

Once the SDK is imported, you can create instances of the `Webhook` and `Client` classes.


## Using `Messenger.Webhook`

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

You can also [emit](#emit) events, which can be useful for testing:

```js
Webhook.emit('messaging_postbacks', event_type, sender_info, webhook_event);
```

#### Callback Arguments
| **Name** | **Type** | **Description** | **Example** |
|------|------|-------------|--------|
| event_type | Object | Contains the event type and subtype. If the webhook has no subtype, then `event_type.subtype` will be `null` | `{'type': 'messaging_handovers', 'subtype': 'pass_thread_control}` |
| sender_info | Object | Contains the ID and ID type. | `{'value': '84736289974242', 'type': 'PSID'}` |
| webhook_event | Object | The complete webhook event parsed from the `messaging` array of the received `POST` request. | For webhook event formats and details, see the [webhook event reference](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/) in the Messenger Platform docs. |

#### Supported Webhook Events

All webhook events sent by the Messenger Platform are supported. To listen for the event, all you have to do is attach an event listener for the event name:

- `messages`
- `messaging_postbacks`
- `message_reads`
- `message_echoes`
- `message_deliveries`
- `messaging_handovers`
- `messaging_referrals`
- `messaging_optins`
- `messaging_payments`
- `messaging_pre_checkouts`
- `messaging_checkout_updates`
- `messaging_game_plays`
- `messaging_policy_enforcement`
- `messaging_account_linking`
- `standby`



## Using `Messenger.Client`

Once you have a working webhook, you need a way to respond to the events and messages your bot receives. This means you need to be able to send allllll kiiinnndddsss of API requests to the Messenger Platform. The `Client` provided by this SDK makes this a much simpler declarative process by handling all the repetitive (and error prone) parts of formatting valid API requests for you, and making sure they get sent to the right place.

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

#### Examples

Here are a few example requests. The [Reference](#reference) also includes examples for every call.

__Send a Text Message__

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
  })
  .catch(e => {
    console.error(e);
  });
```

__Send a Generic Template Message__

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

__Get a User's Profile__

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


## Reference
<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Client](#client)
    -   [uploadAttachment](#uploadattachment)
    -   [setPageToken](#setpagetoken)
    -   [getPageToken](#getpagetoken)
    -   [setAppToken](#setapptoken)
    -   [getAppToken](#getapptoken)
    -   [setApiVersion](#setapiversion)
    -   [getApiVersion](#getapiversion)
    -   [sendBroadcast](#sendbroadcast)
    -   [startBroadcastReachEstimation](#startbroadcastreachestimation)
    -   [getBroadcastReachEstimation](#getbroadcastreachestimation)
    -   [createCustomLabel](#createcustomlabel)
    -   [getCustomLabelById](#getcustomlabelbyid)
    -   [getCustomLabelsByPsid](#getcustomlabelsbypsid)
    -   [getAllCustomLabels](#getallcustomlabels)
    -   [deleteCustomLabel](#deletecustomlabel)
    -   [addPsidtoCustomLabel](#addpsidtocustomlabel)
    -   [removePsidfromCustomLabel](#removepsidfromcustomlabel)
    -   [createMessageCreative](#createmessagecreative)
    -   [sendText](#sendtext)
    -   [sendQuickReplies](#sendquickreplies)
    -   [sendAttachment](#sendattachment)
    -   [sendTemplate](#sendtemplate)
    -   [sendSenderAction](#sendsenderaction)
    -   [sendSponsoredMessage](#sendsponsoredmessage)
    -   [getMessagingInsights](#getmessaginginsights)
    -   [generateMessengerCode](#generatemessengercode)
    -   [setMessengerProfile](#setmessengerprofile)
    -   [getMessengerProfile](#getmessengerprofile)
    -   [deleteMessengerProfile](#deletemessengerprofile)
    -   [setNlpConfigs](#setnlpconfigs)
    -   [getMatchingPsids](#getmatchingpsids)
    -   [getMatchingAsids](#getmatchingasids)
    -   [getUserProfile](#getuserprofile)
-   [Webhook](#webhook)
    -   [on](#on)
    -   [once](#once)
    -   [emit](#emit)
    -   [getInstance](#getinstance)
    -   [stopInstance](#stopinstance)
    -   [getPort](#getport)
    -   [getEndpoint](#getendpoint)
    -   [getVerifyToken](#getverifytoken)
    -   [setAppSecret](#setappsecret)
    -   [validateSignedRequest](#validatesignedrequest)

## Client

Creates an instance of `Client`, used for sending requests to the Messenger Platform APIs.

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that contains the configuration settings for the `Client`.
    -   `options.page_token` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** A valid Page-scoped access token.
    -   `options.app_token` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** _Optional._ A valid app-scoped access token. Required for ID Matching.
    -   `options.graph_api_version` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** _Optional._ The version of the Graph API to target for all API requests. Defaults to latest. Must be in the format `v2.11`.

**Examples**

```javascript
const Messenger = require('messenger-node');
let options = {
  'page_token': 'sd0we98h248n2g40gh4g80h32',
  'app_token': 'ih908wh084ggh423940hg934g358h0358hg3', //optional
  'api_version': 'v2.9' //optional
}
const Client = new Messenger.Client(options);
```

Returns **[Client](#client)** 

### uploadAttachment

Uploads media using the [Attachment Upload API](https://developers.facebook.com/docs/messenger-platform/reference/attachment-upload-api).

**Parameters**

-   `attachment` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the attachment to send.
    -   `attachment.type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The type of asset being upload. Must be `image`, `video`, `audio`, or `file`.
    -   `attachment.source` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The location of the asset. Must be a valid URL or complete filesystem location.
    -   `attachment.is_reusable` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** **Optional.** Set to `true` to return a reusable attachment ID.

**Examples**

_Upload from URL_

```javascript
let recipient = {'id': '57024957309673'},
    attachment = {
      'type':'image', 
       'source':'https://www.example.com/dog.png', 
       'is_reusable':true           
    }
Client.uploadAttachment('url', 'https://www.example.com/image.jpg')
 .then(res => {
    console.log(res) // {'attachment_id': 09754203957254}
 });
```

_Upload from file_

```javascript
let recipient = {'id': '57024957309673'},
    attachment = {
      'type':'image', 
       'source':'/Users/me/Desktop/dog.jpg', 
       'is_reusable':true           
    }
Client.uploadAttachment(attachment)
 .then(res => {
    console.log(res); // {'attachment_id': 09754203957254}
 });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### setPageToken

Sets a new page token to use for all Page-level requests

**Parameters**

-   `token`  
-   `page_token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The new page token

**Examples**

```javascript
Client.setPageToken('sgh084th3t3ht340t34h8t3t940390th34')
 .then(res => {
    console.log(res) // 'sgh084th3t3ht340t34h8t3t940390th34'
 });
```

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Updated page token

### getPageToken

Gets the current page token being used for page-level requests

**Examples**

```javascript
Client.getPageToken()
 .then(res => {
    console.log(res) // 'sgh084th3t3ht340t34h8t3t940390th34'
 });
```

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Current page token

### setAppToken

Sets a new app token to use for all app-level requests

**Parameters**

-   `token`  
-   `app_token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The new app token

**Examples**

```javascript
Client.setAppToken('9h03t9h0ahtg409thw3t34h8t3t940390th34')
 .then(res => {
    console.log(res) // '9h03t9h0ahtg409thw3t34h8t3t940390th34'
 });
```

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Updated app token

### getAppToken

Gets the current app token being used for app-level requests

**Examples**

```javascript
Client.getAppToken()
 .then(res => {
    console.log(res) // '9h03t9h0ahtg409thw3t34h8t3t940390th34'
 });
```

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Current app token

### setApiVersion

Sets a new Graph API version to use for all requests

**Parameters**

-   `version` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The new version in the format `v2.11`

**Examples**

```javascript
Client.setApiVersion('v2.6')
 .then(res => {
    console.log(res) // 'v2.6'
 });
```

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Updated version number

### getApiVersion

Gets the current Graph API version being used for all requests

**Examples**

```javascript
Client.getApiVersion()
 .then(res => {
    console.log(res) // 'v2.6'
 });
```

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Current Graph API version

### sendBroadcast

Sends a new broadcast message via the [Broadcast API](https://developers.facebook.com/docs/messenger-platform/reference/broadcast-api).

**Parameters**

-   `message_creative_id` **Integer** The ID of a message creative to send in the broadcast. Created by calling [Client.createMessageCreative()](#createmessagecreative).
-   `custom_label_id` **Integer** _Optional._ The ID of a custom label to target for the broadcast. Created by calling [Client.createCustomLabel()](#createcustomlabel).

**Examples**

```javascript
let message_creative_id = 499792492764246,
    custom_label_id = 097046973276-46; // optional
Client.sendBroadcast(message_creative_id, custom_label_id)
  .then(res => {
    console.log(res); // {'broadcast_id': 397230957240952}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** The API response

### startBroadcastReachEstimation

Start a reach estimation for the number of people that will be 
reached by a broadcast to all users or to users associated with 
a custom label.

**Parameters**

-   `custom_label_id` **Integer** _Optional._ The ID of a custom label targeted by the broadcast. Created by calling [Client.createCustomLabel()](#createcustomlabel).

**Examples**

```javascript
let custom_label_id = 3467390467035645 //optional
Client.startBroadcastReachEstimation(custom_label_id)
  .then(res => {
    console.log(res); // {"reach_estimation_id": "9485676932424"}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API Response

### getBroadcastReachEstimation

Get the current status of a broadcast reach estimation
{@link #startbroadcastreachestimation|`startBroadcastReachEstimation` 
must be run first to get a `reach_estimation_id`.

**Parameters**

-   `reach_estimation_id` **Integer** The reach estimation ID.

**Examples**

```javascript
Client.getBroadcastReachEstimation(9485676932424)
  .then(res => {
    console.log(res); // {"reach_estimation": "100", "id": "9485676932424"}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API Response

### createCustomLabel

Creates a new custom label.

**Parameters**

-   `name` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the custom label.

**Examples**

```javascript
Client.createCustomLabel('my_custom_label')
  .then(res => {
    console.log(res); // {"id": "9485676932424"}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getCustomLabelById

Retrieves the id and name of a custom label.

**Parameters**

-   `label_id` **Integer** The ID of a custom label. Created with [createCustomLabel()](#createcustomlabel).

**Examples**

```javascript
let custom_label_id = 9485676932424,
    field = ['name', 'id']; //optional
Client.getCustomLabelById(custom_label_id, fields)
  .then(res => {
    console.log(res); // {"name": "my_custom_label", "id": "9485676932424"}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getCustomLabelsByPsid

Retrieves the list of custom labels associated with a PSID.

**Parameters**

-   `psid` **Integer** The PSID of the user to retrieve the custom labels for.

**Examples**

```javascript
Client.getCustomLabelsByPsid(950724069735075)
  .then(res => {
    console.log(res);
    // {
    //   "data": [
    //     { "name": "myLabel", "id": "1001200005003"},
    //     { "name": "myOtherLabel", "id": "1001200005002"}
    //   ],
    //   "paging": {
    //     "cursors": {
    //       "before": "QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpyc",
    //       "after": "QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaU"
    //     }
    //   }
    // }
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getAllCustomLabels

Retrieves the list of all custom labels.

**Examples**

```javascript
let field = ['name', 'id']; //optional
Client.getAllCustomLabels(fields)
  .then(res => {
    console.log(res);
    // {
    //   "data": [
    //     { "name": "myLabel", "id": "1001200005003"},
    //     { "name": "myOtherLabel", "id": "1001200005002"}
    //   ],
    //   "paging": {
    //     "cursors": {
    //       "before": "QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpyc",
    //       "after": "QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaU"
    //     }
    //   }
    // }
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### deleteCustomLabel

Deletes a custom label.

**Parameters**

-   `label_id` **Integer** The ID of the custom label to delete.

**Examples**

```javascript
Client.deleteCustomLabel(094730967209673)
  .then(res => {
    console.log(res); // {"success": true}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### addPsidtoCustomLabel

Associates a user's PSID to a custom label.

**Parameters**

-   `psid` **Integer** PSID of the user to associate with the custom label.
-   `label_id` **Integer** The ID of a custom label. Created with [createCustomLabel()](#createcustomlabel).

**Examples**

```javascript
let psid = 49670354734069743,
    custom_label_id = 0957209720496743; 
Client.addPsidtoCustomLabel(psid, custom_label_id)
  .then(res => {
    console.log(res); // {"success": true}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### removePsidfromCustomLabel

Removes a user PSID from a custom label.

**Parameters**

-   `psid` **Integer** PSID of the user to remove from the custom label.
-   `label_id` **Integer** The ID of a custom label.

**Examples**

```javascript
let psid = 49670354734069743,
    custom_label_id = 0957209720496743; 
Client.removePsidfromCustomLabel(psid, custom_label_id)
  .then(res => {
    console.log(res); // {"success": true}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### createMessageCreative

Creates a new message creative.

**Parameters**

-   `message` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the message to send.

**Examples**

_Text Message_

```javascript
let message = {'text': 'my text message'};
Client.createMessageCreative(message)
  .then(res => {
    console.log(res); // {"message_creative_id": "953434576932424"}
  });
```

_Template Message_

```javascript
let message = {
  template_type: 'generic',
  elements: [
    {
      'title':'This is a generic template',
      'subtitle':'Plus a subtitle!',
      'image_url':'https://www.example.com/dog.jpg',
      'buttons':[
        {
          'type':'postback',
          'title':'Postback Button',
          'payload':'postback_payload'
        },
        {
          'type': 'web_url',
          'title': 'URL Button',
          'url': 'https://www.example.com/'
        }
      ]      
    }
  ]
};
Client.createMessageCreative(message)
  .then(res => {
    console.log(res); // {"message_creative_id": "953434576932424"}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendText

Sends a text message via the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api).

**Parameters**

-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.
-   `text` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The text to send.

**Examples**

```javascript
let recipient = {'id': '57024957309673'},
    text = 'This is a text message';
Client.sendText(text)
  .then(res => {
    console.log(res);
    // {
    //   "recipient_id": "1008372609250235", 
    //   "message_id": "mid.1456970487936:c34767dfe57ee6e339"
    // }
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendQuickReplies

Sends a set of quick reply buttons  via the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api).

**Parameters**

-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.
-   `quick_replies` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the quick replies to send. This is the `message.quick_replies` property that would normally be included in a Send API request.
-   `text` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** _Optional._ Text message to send with quick replies.

**Examples**

_Generic Template_

```javascript
let recipient = {'id': '57024957309673'};
let quick_replies = [
  {
    'content_type':'text',
    'title':'Quick Reply 1',
    'image_url':'https://www.example.com/icon.png',
    'payload':'quick_reply_payload'
  },
  {
    'content_type':'location'
  }
];
let text = 'Text message to send with the quick replies'; //optional
Client.sendQuickReplies(recipient, quick_replies, text)
  .then(res => {
    console.log(res);
    // {
    //   "recipient_id": "1008372609250235", 
    //   "message_id": "mid.1456970487936:c34767dfe57ee6e339"
    // }
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendAttachment

Sends a standalone attachment, including images, audio, video, and files  via the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api).

**Parameters**

-   `attachment` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the attachment to send.
    -   `attachment.type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The type of asset being upload. Must be `image`, `video`, `audio`, or `file`.
    -   `attachment.source` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The location of the asset. Must be a valid URL or complete filesystem location.
    -   `attachment.is_reusable` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** **Optional.** Set to `true` to return a reusable attachment ID.
-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.

**Examples**

_Send attachment from URL_

```javascript
let recipient = {'id': '57024957309673'},
    attachment = {
      'type':'image', 
       'source':'https://www.example.com/dog.png', 
       'is_reusable':true           
    }
Client.sendAttachment(attachment, recipient)
  .then(res => {
    console.log(res); // {"id": "9485676932424"}
    // {
    //   "recipient_id": "1008372609250235", 
    //   "message_id": "mid.1456970487936:c34767dfe57ee6e339",
    //   "attachment_id": "395723096739076353"
    // }
  });
});
```

_Send attachment from file_

```javascript
let recipient = {'id': '57024957309673'},
    attachment = {
      'type':'image', 
       'source':'/Users/me/Desktop/dog.jpg', 
       'is_reusable':true           
    }
Client.uploadAttachment(attachment, recipient)
 .then(res => {
    console.log(res); // {'attachment_id': 09754203957254}
    // {
    //   "recipient_id": "1008372609250235", 
    //   "message_id": "mid.1456970487936:c34767dfe57ee6e339",
    //   "attachment_id": "395723096739076353"
    // }
 });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendTemplate

Sends a template message via the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api).

**Parameters**

-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.
-   `template` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the template to send. This is the `message.attachment.payload` property that would normally be included in a Send API request.

**Examples**

_Generic Template_

```javascript
let recipient = {'id': '57024957309673'};
let message = {
  template_type: 'generic',
  elements: [
    {
      'title':'This is a generic template',
      'subtitle':'Plus a subtitle!',
      'image_url':'https://www.example.com/dog.jpg',
      'buttons':[
        {
          'type':'postback',
          'title':'Postback Button',
          'payload':'postback_payload'
        },
        {
          'type': 'web_url',
          'title': 'URL Button',
          'url': 'https://www.example.com/'
        }
      ]      
    }
  ]
};
Client.sendTemplate(message)
  .then(res => {
    console.log(res);
    // {
    //   "recipient_id": "1008372609250235", 
    //   "message_id": "mid.1456970487936:c34767dfe57ee6e339"
    // }
  });
```

_Media Template_

```javascript
let recipient = {'id': '57024957309673'};
let message = {
  'template_type': 'media',
  'elements': [
    {
      'media_type': 'image',
      'url': 'https://www.example.com/dog.jpg'
    },
    'buttons':[
      {
        'type': 'web_url',
        'title': 'URL Button',
        'url': 'https://www.example.com/'
      }
    ]    
  ]
};
Client.sendTemplate(message)
  .then(res => {
    console.log(res);
    // {
    //   "recipient_id": "1008372609250235", 
    //   "message_id": "mid.1456970487936:c34767dfe57ee6e339"
    // }
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendSenderAction

Sends a sender action via the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api).

**Parameters**

-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.
-   `sender_action` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The sender action to send. Must be `typing_on`, `typing_off`, or `mark_seen`.

**Examples**

```javascript
let recipient = {'id': '57024957309673'},
    sender_action = 'mark_seen';
Client.sendSenderAction(recipient, sender_action)
  .then(res => {
    console.log(res); // {"recipient_id": "1008372609250235"}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendSponsoredMessage

Sends a new [Sponsored Message via the Messenger Platform](https://developers.facebook.com/docs/messenger-platform/reference/sponsored-messages).

**Parameters**

-   `ad_account_id` **Integer** Your Facebook Ads account ID.
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the sponsored message to send.
    -   `options.message_creative_id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The ID of a message creative to send. Created by calling [Client.createMessageCreative()](#createmessagecreative).
    -   `options.daily_budget` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The maximum daily budget of the ad campaign for the Sponsored Message send.
    -   `options.bid_amount` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The maximum bid for each message recipient.
    -   `options.targeting` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** [Targeting spec](https://developers.facebook.com/docs/marketing-api/targeting-specs) for the Sponsored Message send.

**Examples**

```javascript
let options = {
  'message_creative_id': '34967347634346',
  'daily_budget': '10',
  'bid_amount': '1',
  'targeting': '{'geo_locations': {'countries':['US']}}',
  'ad_account_id': '9352379502706' 
};
Client.sendSponsoredMessage('test', options)
  .then(res => {
    console.log(res);
    // {
    //   "ad_group_id": "6088387928148",
    //   "broadcast_id": "754911018029273",
    //   "success": true
    // }
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getMessagingInsights

Retrieves metrics from the [Messaging Insights API](https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api).

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the metrics data to retrieve.
    -   `options.metrics` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** An array list of the metrics to retrieve.
    -   `options.since` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** _Optional._ UNIX timestamp of the start time to get the metric for.
    -   `options.until` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** _Optional._ UNIX timestamp of the end time to get the metric for.

**Examples**

```javascript
let today = new Date().getTime();
let options = {
  'metrics': [
    'page_messages_active_threads_unique',
    'page_messages_blocked_conversations_unique',
    'page_messages_reported_conversations_unique',
    'page_messages_reported_conversations_by_report_type_unique'
  ],
  'since': today - 864000,
  'until': today
};
Client.getMessagingInsights(options)
  .then(res => {
    console.log(res);
    // { 
    //   "data": [ 
    //     { 
    //       "name": "<METRIC>", 
    //       "period": "day", 
    //       "values": [ 
    //         { 
    //           "value": "<VALUE>", 
    //           "end_time": "<UTC_TIMESTAMP>" 
    //         }, 
    //         { 
    //           "value": "<VALUE>", 
    //           "end_time": "<UTC_TIMESTAMP>" 
    //         }
    //      ]
    //     } 
    //   ],
    // } 
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### generateMessengerCode

Generate a new static or parametric [Messenger Code](https://developers.facebook.com/docs/messenger-platform/reference/messenger-code-api) for your bot.

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that describes the Messenger Code to generate.
    -   `options.ref` **Integer** The ref string to pass to your bot is opened via the code. Max 250 characters. Valid characters: `a-z A-Z 0-9 +/=-.:_`.
    -   `options.image_size` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The size, in pixels, for the image you are requesting. Supported range: 100-2000. Defaults to 1000.

**Examples**

```javascript
let options = {
  'ref': 'referral_ref', //optional
  'image_size': 500 //optional
};
Client.generateMessengerCode(options)
  .then(res => {
    console.log(res); // {"uri": "https://scontent.xx.fbcdn.net/v/t39..."}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### setMessengerProfile

Sets one or more properties of your bot's [Messenger Profile](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api).

**Parameters**

-   `fields` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object that contains the Messenger Profile properties to set as key-value pairs.

**Examples**

```javascript
let fields = {
  'whitelisted_domains': ['https://www.example.com'],    
  'get_started': {
    'payload': 'callback_payload'
  },
  'greeting': [
    {
      'locale':'default',
      'text':'Hello!'
    }, {
      'locale':'en_US',
      'text':'Timeless apparel for the masses.'
    }
  ]
};
Client.setMessengerProfile(fields)
  .then(res => {
    console.log(res); // {"result": "success"}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getMessengerProfile

Retrieves one or more properties of your bot's [Messenger Profile](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api).

**Parameters**

-   `fields` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** _Optional._ An array list of the Messenger Profile filds to retrieve.

**Examples**

```javascript
let fields = ['whitelisted_domains', 'greeting'];
Client.getMessengerProfile(fields)
  .then(res => {
    console.log(res);
    // {
    //    "data": [
    //         {
    //           "whitelisted_domains": [
    //             "https://facebook.com/"
    //           ],
    //           "greeting": [
    //             {
    //                "locale": "default",
    //                "text": "Hello!"
    //             }
    //          ]
    //       }
    //    ]
    // } 
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### deleteMessengerProfile

Deletes one or more properties of your bot's [Messenger Profile](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api).

**Parameters**

-   `fields` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** _Optional._ An array list of the Messenger Profile filds to delete.

**Examples**

```javascript
let fields = ['whitelisted_domains', 'greeting'];
Client.deleteMessengerProfile(fields)
  .then(res => {
    console.log(res); // {"id": "9485676932424"}
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### setNlpConfigs

Sets config values for [built-in NLP]\(<https://developers.facebook.com/docs/messenger-platform/built-in-nlp>.

**Parameters**

-   `configs` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The NLP configs to set

**Examples**

```javascript
let configs = {
  'nlp_enabled': true,
  'model': 'ENGLISH',
  'custom_token': '924t2904t7304ty3wo',
  'verbose': true,
  'n_best': 2
}
Client.setNlpConfigs(configs).then(res => {
 .then(res => {
    console.log(res) // { 'success': true }
 });
```

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** configs.nlp_enabled  Enable/disable built-in NLP. Must be `true` or `false`

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** configs.model  The default NLP model to use. For values, see the [Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/built-in-nlp#api).

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** configs.custom_token  [Wit.ai](https://wit.ai/) server token for integrating a custom model.

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** configs.verbose  Enables verbose mode, which returns extra information like the position of the detected entity in the query. Must be `true` or `false`.

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** configs.n_best  The number of entities to return, in descending order of confidence. Minimum 1. Maximum 8.

### getMatchingPsids

Returns all Page-scoped IDs (PSIDs) for a user across all Pages in the same 
Facebook Business Manager account. Matches can be found using 
a PSID or ASID. Uses the [ID Matching API](https://developers.facebook.com/docs/messenger-platform/identity/id-matching).

**Parameters**

-   `id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** A valid ASID or PSID.
-   `id_type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The type of ID provided in the `id` argument: `ASID` or `PSID`.

**Examples**

```javascript
Client.getMatchingPsids('95740976304764', 'PSID')
  .then(res => {
    console.log(res);
    // {
    //    "data": [
    //      {
    //        "id": "1429384723454138",
    //        "page": {
    //            "name": "MyPage1",
    //            "id": "9384723458738365"
    //        }
    //      },
    //      {
    //        "id": "1254459384723459",
    //        "page": {
    //            "name": "MyPage2",
    //            "id": "689384723453165"
    //        }
    //      }
    //    ],
    //    "paging": {
    //        "cursors": {
    //            "before": "MTA4MDYxNjQ2ODczODM2NQZDZD",
    //            "after": "NjgyNDk4MTcxOTQzMTY1"
    //        }
    //    }
    // } 
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getMatchingAsids

Returns all app-scoped IDs (ASIDs) for a user across all Pages in the same 
Facebook Business Manager account. Matches can be found using 
a PSID or ASID. Uses the [ID Matching API](https://developers.facebook.com/docs/messenger-platform/identity/id-matching).

**Parameters**

-   `id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** A valid ASID or PSID.
-   `id_type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The type of ID provided in the `id` argument: `ASID` or `PSID`.

**Examples**

```javascript
Client.getMatchingAsids('95740976304764', 'PSID')
  .then(res => {
    console.log(res);
    // {
    //    "data": [
    //      {
    //        "id": "7234541381429384",
    //        "app": {
    //            "link": "https://www.facebook.com/games/?app_id=299493827472589",
    //            "name": "MyApp1",
    //            "id": "9948573218738365"
    //        }
    //      },
    //      {
    //        "id": "9384723459125445",
    //        "app": {
    //            "link": "https://www.facebook.com/games/?app_id=299490394856589",
    //            "name": "MyApp2",
    //            "id": "689384785732187"
    //        }
    //      }
    //    ],
    //    "paging": {
    //        "cursors": {
    //            "before": "ODczODM2NQZDZDMTA4MDYxNjQ2",
    //            "after": "TcxOTQzMTY1NjgyNDk4M"
    //        }
    //    }
    // } 
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getUserProfile

Retrieves a user's profile via the [User Profile API](https://developers.facebook.com/docs/messenger-platform/identity/user-profile).

**Parameters**

-   `psid` **Integer** A valid user PSID.
-   `fields` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** _Optional._ An array list of the user profile filds to retrieve. For a list of available fields, see the [Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/identity/user-profile#fields).

**Examples**

```javascript
let profile_fields = [
  'id',
  'first_name',
  'last_name',
  'profile_pic',
  'locale',
];
Client.getUserProfile('490730697356', profile_fields)
  .then(res => {
    console.log(res);
    // {
    //   "first_name": "Peter",
    //   "last_name": "Chang",
    //   "profile_pic": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p200x200/13055603_10105219398495383_8237637584159975445_n.jpg?oh=1d241d4b6d4dac50eaf9bb73288ea192&oe=57AF5C03&__gda__=1470213755_ab17c8c8e3a0a447fed3f272fa2179ce",
    //   "locale": "en_US", 
    // }
  });
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

## Webhook

Creates and starts a webhook that emits all received webhook events.

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Configuration options for your webhook. All options may also be set as environment variables.
    -   `options.verify_token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** May also be set as `MESSENGER_VERIFY_TOKEN` in environment variables.
    -   `options.endpoint` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** _Optional._ Defaults to `/webhook`. May also be set as `MESSENGER_APP_ENDPOINT` in environment variables.
    -   `options.app_secret` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** _Optional._ Your app secret. Required for `validateSignedRequest()`. May also be set as `MESSENGER_APP_SECRET` in environment variables.
    -   `options.port` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** _Optional._ Defaults to `1337`. May also be set as `MESSENGER_PORT` in environment variables.

**Examples**

```javascript
const Messenger = require('messenger-node');

// you can also set these as env vars
let options = {
  'verify_token': 'my_voice_is_my_passport',
  'app_secret': 'ih908wh084ggh423940hg934g358h0358hg3', //optional
  'endpoint': '/awesomewebhook' //optional
  'port': '9485' //optional
}
const Webhook = new Messenger.Webhook(options);
```

Returns **[Webhook](#webhook)** 

### on

Adds an event listener. Implements Node.js EventEmitter's [`emitter.on`](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener).

**Parameters**

-   `event_name` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the event to listen for.
-   `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The callback to execute when the event is received.

**Examples**

```javascript
Webhook.on('messaging_postbacks', (event_type, sender_info, webhook_event) => {
  // do something 
});
```

### once

Adds a one-time event listener that will be removed after it is called once. Implements Node.js EventEmitter's [`emitter.once`](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener).

**Parameters**

-   `event_name` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the event to listen for.
-   `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The callback to execute when the event is received.

**Examples**

```javascript
Webhook.once('messaging_postbacks', (event_type, sender_info, webhook_event) => {
  // do something 
});
```

### emit

Emits an event from the Webhook instance. Event listeners can be set with `Webhook.on()` and `Webhook.once()`. Implements Node.js EventEmitter's [`emitter.once`](https://nodejs.org/api/events.html#events_emitter_emit_eventname_args).

**Parameters**

-   `eventName` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The name of the event to emit.

**Examples**

```javascript
Webhook.emit('my_event', arg1, arg2);
```

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** ...args  _Optional._ Arguments to pass to the event listener.

### getInstance

Retrieves the current Webhook instance. This is the express.js [`app`](http://expressjs.com/en/4x/api.html#app) instance.

**Examples**

```javascript
let instance = Webhook.getInstance();
console.log(instance) // express.js app instance
```

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The Webhook instance.

### stopInstance

Stops the Webhook instance.

**Parameters**

-   `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** A callback function to execute when the webhook is stopped.

**Examples**

```javascript
Webhook.stopInstance(() => console.log('Webhook is stopped'));
```

### getPort

Retrieves the port the webhook is running on.

**Examples**

```javascript
let port = Webhook.getPort();
console.log(port) // '1337'
```

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The current port number.

### getEndpoint

Retrieves the current endpoint of the webhook.

**Examples**

```javascript
let endpoint = Webhook.getEndpoint();
console.log(endpoint) // '/webhook'
```

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The current endpoint.

### getVerifyToken

Retrieves the current verify token of the webhook.

**Examples**

```javascript
let verifyToken = Webhook.getVerifyToken();
console.log(verifyToken) // 'my_verify_token'
```

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The current verify token.

### setAppSecret

Sets the app secret used for validating signed requests.

**Parameters**

-   `app_secret` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The app secret to set.

**Examples**

```javascript
let app_secret = Webhook.setAppSecret('hgr0a8h30gh30agh');
console.log(app_secret) // 'hgr0a8h30gh30agh'
```

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The app secret that was successfully set.

### validateSignedRequest

Verifies a signed request received by calling [`getcontext()`](https://developers.facebook.com/docs/messenger-platform/webview/context) in the Messenger webview.

**Parameters**

-   `signed_request` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The signed request.

**Examples**

```javascript
let request = {
  'tid': '1254453049382119',
  'thread_type': 'USER_TO_PAGE', 
  'psid': '1254413049321919',
  'signed_request': 'QDTuYBidQ7pbpxIbPwgsb__nHty2...'
};   
let decrypted_request = Webhook.validateSignedRequest(signed_request);

console.log(decrypted_request)
// {
//   "psid": "1254413049321919", 
//   "algorithm": "HMAC-SHA256", 
//   "thread_type": "GROUP", 
//   "tid": "1254453049382119", 
//   "issued_at": 1491351619, 
//   "page_id": 239483560376726
// }
```

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The decrypted signed request.
