# Messenger Platform Node.js SDK

[![Build Status](https://travis-ci.org/amuramoto/messenger-node.svg?branch=master)](https://travis-ci.org/amuramoto/messenger-node) * Build is failing right now because one of my test accounts got permissions revoked or something, but the SDK still works as expected

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

-   [Client][1]
    -   [Parameters][2]
    -   [Examples][3]
    -   [uploadAttachment][4]
        -   [Parameters][5]
        -   [Examples][6]
    -   [setPageToken][7]
        -   [Parameters][8]
        -   [Examples][9]
    -   [getPageToken][10]
        -   [Examples][11]
    -   [setAppToken][12]
        -   [Parameters][13]
        -   [Examples][14]
    -   [getAppToken][15]
        -   [Examples][16]
    -   [setApiVersion][17]
        -   [Parameters][18]
        -   [Examples][19]
    -   [getApiVersion][20]
        -   [Examples][21]
    -   [passThreadControl][22]
        -   [Parameters][23]
        -   [Examples][24]
    -   [takeThreadControl][25]
        -   [Parameters][26]
        -   [Examples][27]
    -   [requestThreadControl][28]
        -   [Parameters][29]
        -   [Examples][30]
    -   [getThreadOwner][31]
        -   [Parameters][32]
        -   [Examples][33]
    -   [getSecondaryReceiverList][34]
        -   [Parameters][35]
        -   [Examples][36]
    -   [sendBroadcast][37]
        -   [Parameters][38]
        -   [Examples][39]
    -   [startBroadcastReachEstimation][40]
        -   [Parameters][41]
        -   [Examples][42]
    -   [getBroadcastReachEstimation][43]
        -   [Parameters][44]
        -   [Examples][45]
    -   [createCustomLabel][46]
        -   [Parameters][47]
        -   [Examples][48]
    -   [getCustomLabelById][49]
        -   [Parameters][50]
        -   [Examples][51]
    -   [getCustomLabelsByPsid][52]
        -   [Parameters][53]
        -   [Examples][54]
    -   [getAllCustomLabels][55]
        -   [Examples][56]
    -   [deleteCustomLabel][57]
        -   [Parameters][58]
        -   [Examples][59]
    -   [addPsidtoCustomLabel][60]
        -   [Parameters][61]
        -   [Examples][62]
    -   [removePsidfromCustomLabel][63]
        -   [Parameters][64]
        -   [Examples][65]
    -   [createMessageCreative][66]
        -   [Parameters][67]
        -   [Examples][68]
    -   [sendText][69]
        -   [Parameters][70]
        -   [Examples][71]
    -   [sendQuickReplies][72]
        -   [Parameters][73]
        -   [Examples][74]
    -   [sendAttachment][75]
        -   [Parameters][76]
        -   [Examples][77]
    -   [sendTemplate][78]
        -   [Parameters][79]
        -   [Examples][80]
    -   [sendSenderAction][81]
        -   [Parameters][82]
        -   [Examples][83]
    -   [sendSponsoredMessage][84]
        -   [Parameters][85]
        -   [Examples][86]
    -   [getMessagingInsights][87]
        -   [Parameters][88]
        -   [Examples][89]
    -   [generateMessengerCode][90]
        -   [Parameters][91]
        -   [Examples][92]
    -   [setMessengerProfile][93]
        -   [Parameters][94]
        -   [Examples][95]
    -   [getMessengerProfile][96]
        -   [Parameters][97]
        -   [Examples][98]
    -   [deleteMessengerProfile][99]
        -   [Parameters][100]
        -   [Examples][101]
    -   [setNlpConfigs][102]
        -   [Parameters][103]
        -   [Examples][104]
    -   [getMatchingPsids][105]
        -   [Parameters][106]
        -   [Examples][107]
    -   [getMatchingAsids][108]
        -   [Parameters][109]
        -   [Examples][110]
    -   [getUserProfile][111]
        -   [Parameters][112]
        -   [Examples][113]
-   [Webhook][114]
    -   [Parameters][115]
    -   [Examples][116]
    -   [on][117]
        -   [Parameters][118]
        -   [Examples][119]
    -   [once][120]
        -   [Parameters][121]
        -   [Examples][122]
    -   [emit][123]
        -   [Parameters][124]
        -   [Examples][125]
    -   [getInstance][126]
        -   [Examples][127]
    -   [stopInstance][128]
        -   [Parameters][129]
        -   [Examples][130]
    -   [getPort][131]
        -   [Examples][132]
    -   [getEndpoint][133]
        -   [Examples][134]
    -   [getVerifyToken][135]
        -   [Examples][136]
    -   [setAppSecret][137]
        -   [Parameters][138]
        -   [Examples][139]
    -   [validateSignedRequest][140]
        -   [Parameters][141]
        -   [Examples][142]

## Client

Creates an instance of `Client`, used for sending requests to the Messenger Platform APIs.

### Parameters

-   `options` **[Object][143]** An object that contains the configuration settings for the `Client`.
    -   `options.page_token` **[String][144]** A valid Page-scoped access token.
    -   `options.app_token` **[String][144]** _Optional._ A valid app-scoped access token. Required for ID Matching.
    -   `options.graph_api_version` **[String][144]** _Optional._ The version of the Graph API to target for all API requests. Defaults to latest. Must be in the format `v2.11`.

### Examples

```javascript
const Messenger = require('messenger-node');
let options = {
  'page_token': 'sd0we98h248n2g40gh4g80h32',
  'app_token': 'ih908wh084ggh423940hg934g358h0358hg3', //optional
  'api_version': 'v2.9' //optional
}
const Client = new Messenger.Client(options);
```

Returns **[Client][145]** 

### uploadAttachment

Uploads media using the [Attachment Upload API][146].

#### Parameters

-   `attachment` **[Object][143]** An object that describes the attachment to send.
    -   `attachment.type` **[String][144]** The type of asset being upload. Must be `image`, `video`, `audio`, or `file`.
    -   `attachment.source` **[String][144]** The location of the asset. Must be a valid URL or complete filesystem location.
    -   `attachment.is_reusable` **[String][144]** **Optional.** Set to `true` to return a reusable attachment ID.

#### Examples

Upload from URL


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

Upload from file


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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### setPageToken

Sets a new page token to use for all Page-level requests

#### Parameters

-   `token`  
-   `page_token` **[string][144]** The new page token

#### Examples

```javascript
Client.setPageToken('sgh084th3t3ht340t34h8t3t940390th34')
 .then(res => {
    console.log(res) // 'sgh084th3t3ht340t34h8t3t940390th34'
 });
```

Returns **[string][144]** Updated page token

### getPageToken

Gets the current page token being used for page-level requests

#### Examples

```javascript
Client.getPageToken()
 .then(res => {
    console.log(res) // 'sgh084th3t3ht340t34h8t3t940390th34'
 });
```

Returns **[string][144]** Current page token

### setAppToken

Sets a new app token to use for all app-level requests

#### Parameters

-   `token`  
-   `app_token` **[string][144]** The new app token

#### Examples

```javascript
Client.setAppToken('9h03t9h0ahtg409thw3t34h8t3t940390th34')
 .then(res => {
    console.log(res) // '9h03t9h0ahtg409thw3t34h8t3t940390th34'
 });
```

Returns **[string][144]** Updated app token

### getAppToken

Gets the current app token being used for app-level requests

#### Examples

```javascript
Client.getAppToken()
 .then(res => {
    console.log(res) // '9h03t9h0ahtg409thw3t34h8t3t940390th34'
 });
```

Returns **[string][144]** Current app token

### setApiVersion

Sets a new Graph API version to use for all requests

#### Parameters

-   `version` **[string][144]** The new version in the format `v2.11`

#### Examples

```javascript
Client.setApiVersion('v2.6')
 .then(res => {
    console.log(res) // 'v2.6'
 });
```

Returns **[string][144]** Updated version number

### getApiVersion

Gets the current Graph API version being used for all requests

#### Examples

```javascript
Client.getApiVersion()
 .then(res => {
    console.log(res) // 'v2.6'
 });
```

Returns **[string][144]** Current Graph API version

### passThreadControl

Initiates a new handover protocol [pass thread control][148] event.

#### Parameters

-   `psid` **Integer** The PSID of the user whose thread you want to initiate the pass thread control event for.
-   `target_app_id` **Integer** _Optional._ The app ID of the app to pass thread control to. Set to `page_inbox` to pass thread control to the Page Inbox.
-   `metadata` **[String][144]** _Optional._ An arbitrary string that will be delivered to the target app with the `messaging_handovers` webhook event.

#### Examples

```javascript
let psid = 1008372609250235,
    target_app_id = 1719933432123212,
    metadata = 'I passed control to you'; // optional
Client.passThreadControl(psid, target_app_id, metadata)
  .then(res => {
    console.log(res); // {'success': true}
  });
```

Returns **[Promise][147]** The API response

### takeThreadControl

Initiates a new handover protocol [take thread control][149] event.
This may only be called by the app with the Primary Receiver app role.

#### Parameters

-   `psid` **Integer** The PSID of the user whose thread you want to initiate the take thread control event for.
-   `metadata` **[String][144]** _Optional._ An arbitrary string that will be delivered to the Secondary Receiver app with the `messaging_handovers` webhook event.

#### Examples

```javascript
let psid = 1008372609250235,
    metadata = 'I'm taking control from you'; // optional
Client.takeThreadControl(psid, metadata)
  .then(res => {
    console.log(res); // {'success': true}
  });
```

Returns **[Promise][147]** The API response

### requestThreadControl

Initiates a new handover protocol [request thread control][150] event.

#### Parameters

-   `psid` **Integer** The PSID of the user whose thread you want to initiate the request thread control event for.
-   `metadata` **[String][144]** _Optional._ An arbitrary string that will be delivered to the Primary Receiver app with the `messaging_handovers` webhook event.

#### Examples

```javascript
let psid = 1008372609250235,
    metadata = 'I'm requesting control from you'; // optional
Client.requestThreadControl(psid, metadata)
  .then(res => {
    console.log(res); // {'success': true}
  });
```

Returns **[Promise][147]** The API response

### getThreadOwner

Retrieves the app ID of the current [thread owner][149].

#### Parameters

-   `psid` **Integer** The PSID of the user whose thread you want to get the thread owner of.
-   `metadata` **[String][144]** _Optional._ An arbitrary string that will be delivered to the target app with the `messaging_handovers` webhook event.

#### Examples

```javascript
let psid = 1008372609250235
Client.getThreadOwner(psid)
  .then(res => {
    console.log(res); 
    // {
    //   "data": [{
    //     "thread_owner": {
    //       "app_id": "1719933678308212"
    //     }
    //   }]
    // }
  });
```

Returns **[Promise][147]** The API response

### getSecondaryReceiverList

Retrieves a list of app ID's of all [Secondary Receivers][151] for the Page.

#### Parameters

-   `psid` **Integer** The PSID of the user whose thread you want to get the list of Secondary Receiver apps for.

#### Examples

```javascript
let psid = 1008372609250235
Client.getThreadOwner(psid)
  .then(res => {
    console.log(res); 
    // {
    //   "data": [
    //     {
    //       "id": "12345678910",
    //       "name": "David's Composer"
    //     },
    //     {
    //       "id": "23456789101",
    //       "name": "Messenger Rocks"
    //     }
    //   ]
    // }
  });
```

Returns **[Promise][147]** The API response

### sendBroadcast

Sends a new broadcast message via the [Broadcast API][152].

#### Parameters

-   `message_creative_id` **Integer** The ID of a message creative to send in the broadcast. Created by calling [Client.createMessageCreative()][66].
-   `custom_label_id` **Integer** _Optional._ The ID of a custom label to target for the broadcast. Created by calling [Client.createCustomLabel()][46].

#### Examples

```javascript
let message_creative_id = 499792492764246,
    custom_label_id = 097046973276-46; // optional
Client.sendBroadcast(message_creative_id, custom_label_id)
  .then(res => {
    console.log(res); // {'broadcast_id': 397230957240952}
  });
```

Returns **[Promise][147]** The API response

### startBroadcastReachEstimation

Start a reach estimation for the number of people that will be 
reached by a broadcast to all users or to users associated with 
a custom label.

#### Parameters

-   `custom_label_id` **Integer** _Optional._ The ID of a custom label targeted by the broadcast. Created by calling [Client.createCustomLabel()][46].

#### Examples

```javascript
let custom_label_id = 3467390467035645 //optional
Client.startBroadcastReachEstimation(custom_label_id)
  .then(res => {
    console.log(res); // {"reach_estimation_id": "9485676932424"}
  });
```

Returns **[Promise][147]&lt;[Object][143]>** The API Response

### getBroadcastReachEstimation

Get the current status of a broadcast reach estimation
{@link #startbroadcastreachestimation|`startBroadcastReachEstimation` 
must be run first to get a `reach_estimation_id`.

#### Parameters

-   `reach_estimation_id` **Integer** The reach estimation ID.

#### Examples

```javascript
Client.getBroadcastReachEstimation(9485676932424)
  .then(res => {
    console.log(res); // {"reach_estimation": "100", "id": "9485676932424"}
  });
```

Returns **[Promise][147]&lt;[Object][143]>** The API Response

### createCustomLabel

Creates a new custom label.

#### Parameters

-   `name` **[String][144]** The name of the custom label.

#### Examples

```javascript
Client.createCustomLabel('my_custom_label')
  .then(res => {
    console.log(res); // {"id": "9485676932424"}
  });
```

Returns **[Promise][147]&lt;[Object][143]>** The API response

### getCustomLabelById

Retrieves the id and name of a custom label.

#### Parameters

-   `label_id` **Integer** The ID of a custom label. Created with [createCustomLabel()][46].

#### Examples

```javascript
let custom_label_id = 9485676932424,
    field = ['name', 'id']; //optional
Client.getCustomLabelById(custom_label_id, fields)
  .then(res => {
    console.log(res); // {"name": "my_custom_label", "id": "9485676932424"}
  });
```

Returns **[Promise][147]&lt;[Object][143]>** The API response

### getCustomLabelsByPsid

Retrieves the list of custom labels associated with a PSID.

#### Parameters

-   `psid` **Integer** The PSID of the user to retrieve the custom labels for.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### getAllCustomLabels

Retrieves the list of all custom labels.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### deleteCustomLabel

Deletes a custom label.

#### Parameters

-   `label_id` **Integer** The ID of the custom label to delete.

#### Examples

```javascript
Client.deleteCustomLabel(094730967209673)
  .then(res => {
    console.log(res); // {"success": true}
  });
```

Returns **[Promise][147]&lt;[Object][143]>** The API response

### addPsidtoCustomLabel

Associates a user's PSID to a custom label.

#### Parameters

-   `psid` **Integer** PSID of the user to associate with the custom label.
-   `label_id` **Integer** The ID of a custom label. Created with [createCustomLabel()][46].

#### Examples

```javascript
let psid = 49670354734069743,
    custom_label_id = 0957209720496743; 
Client.addPsidtoCustomLabel(psid, custom_label_id)
  .then(res => {
    console.log(res); // {"success": true}
  });
```

Returns **[Promise][147]&lt;[Object][143]>** The API response

### removePsidfromCustomLabel

Removes a user PSID from a custom label.

#### Parameters

-   `psid` **Integer** PSID of the user to remove from the custom label.
-   `label_id` **Integer** The ID of a custom label.

#### Examples

```javascript
let psid = 49670354734069743,
    custom_label_id = 0957209720496743; 
Client.removePsidfromCustomLabel(psid, custom_label_id)
  .then(res => {
    console.log(res); // {"success": true}
  });
```

Returns **[Promise][147]&lt;[Object][143]>** The API response

### createMessageCreative

Creates a new message creative.

#### Parameters

-   `message` **[Object][143]** An object that describes the message to send.

#### Examples

Text Message


```javascript
let message = {'text': 'my text message'};
Client.createMessageCreative(message)
  .then(res => {
    console.log(res); // {"message_creative_id": "953434576932424"}
  });
```

Template Message


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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### sendText

Sends a text message via the [Send API][153].

#### Parameters

-   `recipient` **[Object][143]** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.
-   `text` **[String][144]** The text to send.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### sendQuickReplies

Sends a set of quick reply buttons  via the [Send API][153].

#### Parameters

-   `recipient` **[Object][143]** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.
-   `quick_replies` **[Object][143]** An object that describes the quick replies to send. This is the `message.quick_replies` property that would normally be included in a Send API request.
-   `text` **[String][144]** _Optional._ Text message to send with quick replies.

#### Examples

Generic Template


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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### sendAttachment

Sends a standalone attachment, including images, audio, video, and files  via the [Send API][153].

#### Parameters

-   `attachment` **[Object][143]** An object that describes the attachment to send.
    -   `attachment.type` **[String][144]** The type of asset being upload. Must be `image`, `video`, `audio`, or `file`.
    -   `attachment.source` **[String][144]** The location of the asset. Must be a valid URL or complete filesystem location.
    -   `attachment.is_reusable` **[String][144]** **Optional.** Set to `true` to return a reusable attachment ID.
-   `recipient` **[Object][143]** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.

#### Examples

Send attachment from URL


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

Send attachment from file


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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### sendTemplate

Sends a template message via the [Send API][153].

#### Parameters

-   `recipient` **[Object][143]** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.
-   `template` **[Object][143]** An object that describes the template to send. This is the `message.attachment.payload` property that would normally be included in a Send API request.

#### Examples

Generic Template


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

Media Template


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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### sendSenderAction

Sends a sender action via the [Send API][153].

#### Parameters

-   `recipient` **[Object][143]** An object that describes the message recipient in the format: `{<id_type>: <id>}`.
    For example, sends to a PSID would be `{'id': 123456}`, to a phone number \`{'phone_number': '+1 (408) 444-4444'}.
-   `sender_action` **[String][144]** The sender action to send. Must be `typing_on`, `typing_off`, or `mark_seen`.

#### Examples

```javascript
let recipient = {'id': '57024957309673'},
    sender_action = 'mark_seen';
Client.sendSenderAction(recipient, sender_action)
  .then(res => {
    console.log(res); // {"recipient_id": "1008372609250235"}
  });
```

Returns **[Promise][147]&lt;[Object][143]>** The API response

### sendSponsoredMessage

Sends a new [Sponsored Message via the Messenger Platform][154].

#### Parameters

-   `ad_account_id` **Integer** Your Facebook Ads account ID.
-   `options` **[Object][143]** An object that describes the sponsored message to send.
    -   `options.message_creative_id` **[String][144]** The ID of a message creative to send. Created by calling [Client.createMessageCreative()][66].
    -   `options.daily_budget` **[String][144]** The maximum daily budget of the ad campaign for the Sponsored Message send.
    -   `options.bid_amount` **[String][144]** The maximum bid for each message recipient.
    -   `options.targeting` **[String][144]** [Targeting spec][155] for the Sponsored Message send.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### getMessagingInsights

Retrieves metrics from the [Messaging Insights API][156].

#### Parameters

-   `options` **[Object][143]** An object that describes the metrics data to retrieve.
    -   `options.metrics` **[Array][157]&lt;[String][144]>** An array list of the metrics to retrieve.
    -   `options.since` **[String][144]** _Optional._ UNIX timestamp of the start time to get the metric for.
    -   `options.until` **[String][144]** _Optional._ UNIX timestamp of the end time to get the metric for.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### generateMessengerCode

Generate a new static or parametric [Messenger Code][158] for your bot.

#### Parameters

-   `options` **[Object][143]** An object that describes the Messenger Code to generate.
    -   `options.ref` **Integer** The ref string to pass to your bot is opened via the code. Max 250 characters. Valid characters: `a-z A-Z 0-9 +/=-.:_`.
    -   `options.image_size` **[Object][143]** The size, in pixels, for the image you are requesting. Supported range: 100-2000. Defaults to 1000.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### setMessengerProfile

Sets one or more properties of your bot's [Messenger Profile][159].

#### Parameters

-   `fields` **[Object][143]** An object that contains the Messenger Profile properties to set as key-value pairs.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### getMessengerProfile

Retrieves one or more properties of your bot's [Messenger Profile][159].

#### Parameters

-   `fields` **[Array][157]&lt;[String][144]>** _Optional._ An array list of the Messenger Profile filds to retrieve.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### deleteMessengerProfile

Deletes one or more properties of your bot's [Messenger Profile][159].

#### Parameters

-   `fields` **[Array][157]&lt;[String][144]>** _Optional._ An array list of the Messenger Profile filds to delete.

#### Examples

```javascript
let fields = ['whitelisted_domains', 'greeting'];
Client.deleteMessengerProfile(fields)
  .then(res => {
    console.log(res); // {"id": "9485676932424"}
  });
```

Returns **[Promise][147]&lt;[Object][143]>** The API response

### setNlpConfigs

Sets config values for [built-in NLP]\([https://developers.facebook.com/docs/messenger-platform/built-in-nlp][160].

#### Parameters

-   `configs` **[Object][143]** The NLP configs to set

#### Examples

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

Returns **[String][144]** configs.nlp_enabled  Enable/disable built-in NLP. Must be `true` or `false`

Returns **[String][144]** configs.model  The default NLP model to use. For values, see the [Messenger Platform docs][161].

Returns **[String][144]** configs.custom_token  [Wit.ai][162] server token for integrating a custom model.

Returns **[String][144]** configs.verbose  Enables verbose mode, which returns extra information like the position of the detected entity in the query. Must be `true` or `false`.

Returns **[String][144]** configs.n_best  The number of entities to return, in descending order of confidence. Minimum 1. Maximum 8.

### getMatchingPsids

Returns all Page-scoped IDs (PSIDs) for a user across all Pages in the same 
Facebook Business Manager account. Matches can be found using 
a PSID or ASID. Uses the [ID Matching API][163].

#### Parameters

-   `id` **[String][144]** A valid ASID or PSID.
-   `id_type` **[String][144]** The type of ID provided in the `id` argument: `ASID` or `PSID`.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### getMatchingAsids

Returns all app-scoped IDs (ASIDs) for a user across all Pages in the same 
Facebook Business Manager account. Matches can be found using 
a PSID or ASID. Uses the [ID Matching API][163].

#### Parameters

-   `id` **[String][144]** A valid ASID or PSID.
-   `id_type` **[String][144]** The type of ID provided in the `id` argument: `ASID` or `PSID`.

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

### getUserProfile

Retrieves a user's profile via the [User Profile API][164].

#### Parameters

-   `psid` **Integer** A valid user PSID.
-   `fields` **[Array][157]&lt;[String][144]>** _Optional._ An array list of the user profile filds to retrieve. For a list of available fields, see the [Messenger Platform docs][165].

#### Examples

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

Returns **[Promise][147]&lt;[Object][143]>** The API response

## Webhook

Creates and starts a webhook that emits all received webhook events.

### Parameters

-   `options` **[Object][143]** Configuration options for your webhook. All options may also be set as environment variables.
    -   `options.verify_token` **[string][144]** May also be set as `MESSENGER_VERIFY_TOKEN` in environment variables.
    -   `options.endpoint` **[string][144]** _Optional._ Defaults to `/webhook`. May also be set as `MESSENGER_APP_ENDPOINT` in environment variables.
    -   `options.app_secret` **[string][144]** _Optional._ Your app secret. Required for `validateSignedRequest()`. May also be set as `MESSENGER_APP_SECRET` in environment variables.
    -   `options.port` **[string][144]** _Optional._ Defaults to `1337`. May also be set as `MESSENGER_PORT` in environment variables.

### Examples

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

Returns **[Webhook][166]** 

### on

Adds an event listener. Implements Node.js EventEmitter's [`emitter.on`][167].

#### Parameters

-   `event_name` **[String][144]** The name of the event to listen for.
-   `callback` **[Function][168]** The callback to execute when the event is received.

#### Examples

```javascript
Webhook.on('messaging_postbacks', (event_type, sender_info, webhook_event) => {
  // do something 
});
```

### once

Adds a one-time event listener that will be removed after it is called once. Implements Node.js EventEmitter's [`emitter.once`][169].

#### Parameters

-   `event_name` **[String][144]** The name of the event to listen for.
-   `callback` **[Function][168]** The callback to execute when the event is received.

#### Examples

```javascript
Webhook.once('messaging_postbacks', (event_type, sender_info, webhook_event) => {
  // do something 
});
```

### emit

Emits an event from the Webhook instance. Event listeners can be set with `Webhook.on()` and `Webhook.once()`. Implements Node.js EventEmitter's [`emitter.once`][170].

#### Parameters

-   `eventName` **[Object][143]** The name of the event to emit.

#### Examples

```javascript
Webhook.emit('my_event', arg1, arg2);
```

Returns **[Object][143]** ...args  _Optional._ Arguments to pass to the event listener.

### getInstance

Retrieves the current Webhook instance. This is the express.js [`app`][171] instance.

#### Examples

```javascript
let instance = Webhook.getInstance();
console.log(instance) // express.js app instance
```

Returns **[Object][143]** The Webhook instance.

### stopInstance

Stops the Webhook instance.

#### Parameters

-   `callback` **[Function][168]** A callback function to execute when the webhook is stopped.

#### Examples

```javascript
Webhook.stopInstance(() => console.log('Webhook is stopped'));
```

### getPort

Retrieves the port the webhook is running on.

#### Examples

```javascript
let port = Webhook.getPort();
console.log(port) // '1337'
```

Returns **[String][144]** The current port number.

### getEndpoint

Retrieves the current endpoint of the webhook.

#### Examples

```javascript
let endpoint = Webhook.getEndpoint();
console.log(endpoint) // '/webhook'
```

Returns **[String][144]** The current endpoint.

### getVerifyToken

Retrieves the current verify token of the webhook.

#### Examples

```javascript
let verifyToken = Webhook.getVerifyToken();
console.log(verifyToken) // 'my_verify_token'
```

Returns **[String][144]** The current verify token.

### setAppSecret

Sets the app secret used for validating signed requests.

#### Parameters

-   `app_secret` **[String][144]** The app secret to set.

#### Examples

```javascript
let app_secret = Webhook.setAppSecret('hgr0a8h30gh30agh');
console.log(app_secret) // 'hgr0a8h30gh30agh'
```

Returns **[String][144]** The app secret that was successfully set.

### validateSignedRequest

Verifies a signed request received by calling [`getcontext()`][172] in the Messenger webview.

#### Parameters

-   `signed_request` **[Object][143]** The signed request.

#### Examples

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

Returns **[Object][143]** The decrypted signed request.

[1]: #client

[2]: #parameters

[3]: #examples

[4]: #uploadattachment

[5]: #parameters-1

[6]: #examples-1

[7]: #setpagetoken

[8]: #parameters-2

[9]: #examples-2

[10]: #getpagetoken

[11]: #examples-3

[12]: #setapptoken

[13]: #parameters-3

[14]: #examples-4

[15]: #getapptoken

[16]: #examples-5

[17]: #setapiversion

[18]: #parameters-4

[19]: #examples-6

[20]: #getapiversion

[21]: #examples-7

[22]: #passthreadcontrol

[23]: #parameters-5

[24]: #examples-8

[25]: #takethreadcontrol

[26]: #parameters-6

[27]: #examples-9

[28]: #requestthreadcontrol

[29]: #parameters-7

[30]: #examples-10

[31]: #getthreadowner

[32]: #parameters-8

[33]: #examples-11

[34]: #getsecondaryreceiverlist

[35]: #parameters-9

[36]: #examples-12

[37]: #sendbroadcast

[38]: #parameters-10

[39]: #examples-13

[40]: #startbroadcastreachestimation

[41]: #parameters-11

[42]: #examples-14

[43]: #getbroadcastreachestimation

[44]: #parameters-12

[45]: #examples-15

[46]: #createcustomlabel

[47]: #parameters-13

[48]: #examples-16

[49]: #getcustomlabelbyid

[50]: #parameters-14

[51]: #examples-17

[52]: #getcustomlabelsbypsid

[53]: #parameters-15

[54]: #examples-18

[55]: #getallcustomlabels

[56]: #examples-19

[57]: #deletecustomlabel

[58]: #parameters-16

[59]: #examples-20

[60]: #addpsidtocustomlabel

[61]: #parameters-17

[62]: #examples-21

[63]: #removepsidfromcustomlabel

[64]: #parameters-18

[65]: #examples-22

[66]: #createmessagecreative

[67]: #parameters-19

[68]: #examples-23

[69]: #sendtext

[70]: #parameters-20

[71]: #examples-24

[72]: #sendquickreplies

[73]: #parameters-21

[74]: #examples-25

[75]: #sendattachment

[76]: #parameters-22

[77]: #examples-26

[78]: #sendtemplate

[79]: #parameters-23

[80]: #examples-27

[81]: #sendsenderaction

[82]: #parameters-24

[83]: #examples-28

[84]: #sendsponsoredmessage

[85]: #parameters-25

[86]: #examples-29

[87]: #getmessaginginsights

[88]: #parameters-26

[89]: #examples-30

[90]: #generatemessengercode

[91]: #parameters-27

[92]: #examples-31

[93]: #setmessengerprofile

[94]: #parameters-28

[95]: #examples-32

[96]: #getmessengerprofile

[97]: #parameters-29

[98]: #examples-33

[99]: #deletemessengerprofile

[100]: #parameters-30

[101]: #examples-34

[102]: #setnlpconfigs

[103]: #parameters-31

[104]: #examples-35

[105]: #getmatchingpsids

[106]: #parameters-32

[107]: #examples-36

[108]: #getmatchingasids

[109]: #parameters-33

[110]: #examples-37

[111]: #getuserprofile

[112]: #parameters-34

[113]: #examples-38

[114]: #webhook

[115]: #parameters-35

[116]: #examples-39

[117]: #on

[118]: #parameters-36

[119]: #examples-40

[120]: #once

[121]: #parameters-37

[122]: #examples-41

[123]: #emit

[124]: #parameters-38

[125]: #examples-42

[126]: #getinstance

[127]: #examples-43

[128]: #stopinstance

[129]: #parameters-39

[130]: #examples-44

[131]: #getport

[132]: #examples-45

[133]: #getendpoint

[134]: #examples-46

[135]: #getverifytoken

[136]: #examples-47

[137]: #setappsecret

[138]: #parameters-40

[139]: #examples-48

[140]: #validatesignedrequest

[141]: #parameters-41

[142]: #examples-49

[143]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[144]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[145]: #client

[146]: https://developers.facebook.com/docs/messenger-platform/reference/attachment-upload-api

[147]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[148]: https://developers.facebook.com/docs/messenger-platform/handover-protocol/pass-thread-control

[149]: https://developers.facebook.com/docs/messenger-platform/handover-protocol/take-thread-control

[150]: https://developers.facebook.com/docs/messenger-platform/handover-protocol/request-thread-control

[151]: https://developers.facebook.com/docs/messenger-platform/handover-protocol#secondary_receivers_list

[152]: https://developers.facebook.com/docs/messenger-platform/reference/broadcast-api

[153]: https://developers.facebook.com/docs/messenger-platform/reference/send-api

[154]: https://developers.facebook.com/docs/messenger-platform/reference/sponsored-messages

[155]: https://developers.facebook.com/docs/marketing-api/targeting-specs

[156]: https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api

[157]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[158]: https://developers.facebook.com/docs/messenger-platform/reference/messenger-code-api

[159]: https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api

[160]: https://developers.facebook.com/docs/messenger-platform/built-in-nlp

[161]: https://developers.facebook.com/docs/messenger-platform/built-in-nlp#api

[162]: https://wit.ai/

[163]: https://developers.facebook.com/docs/messenger-platform/identity/id-matching

[164]: https://developers.facebook.com/docs/messenger-platform/identity/user-profile

[165]: https://developers.facebook.com/docs/messenger-platform/identity/user-profile#fields

[166]: #webhook

[167]: https://nodejs.org/api/events.html#events_emitter_on_eventname_listener

[168]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[169]: https://nodejs.org/api/events.html#events_emitter_once_eventname_listener

[170]: https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

[171]: http://expressjs.com/en/4x/api.html#app

[172]: https://developers.facebook.com/docs/messenger-platform/webview/context
