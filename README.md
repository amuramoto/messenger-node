# Messenger Platform Node SDK

## Creating a webhook

```js
const Messenger = require('./index');
const Webhook = new Messenger.Webhook({'verify_token':'<YOUR VERIFY TOKEN>'});
```

## Subscribing to events

```js
Webhook.on('<EVENT NAME>', (event_type, sender_info, webhook_event) => {
  // do something
});
```

For a list of available webhook events, see the [list in the Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/).

### Callback Arguments
| **Name** | **Type** | **Description** | **Example** |
|------|------|-------------|--------|
| event_type | Object | Contains the event type and subtype. If the webhook has no subtype, then `event_type.subtype` will be `null` | `{'type': 'messaging_handovers', 'subtype': 'pass_thread_control}` |
| sender_info | Object | Contains the ID and ID type. | `{'id': '84736289974242', 'type': 'PSID'}` |
| webhook_event | Object | The complete webhook event parsed from the `messaging` array of the received `POST` request. | For webhook event formats and details, see the [webhook event reference](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/) in the Messenger Platform docs. |

## Making API Calls

```js
const Client = new Messenger.Client();
Client.Messages.sendText(payload);
```

## Reference

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
    -   [getMatchingPsids](#getmatchingpsids)
    -   [getMatchingAsids](#getmatchingasids)
    -   [getUserProfile](#getuserprofile)

## Client

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.page_token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.app_token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.graph_api_version` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Client](#client)** 

### uploadAttachment

Uploads media using the Attachment Upload API

**Parameters**

-   `type`  
-   `source`  
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The attachment details
    -   `options.source_type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The source of the attachment. Must be `url` or `file`.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### setPageToken

Sets a new page token to use for all Page-level requests

**Parameters**

-   `token`  
-   `page_token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The new page token

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Updated page token

### getPageToken

Gets the current page token being used for page-level requests

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Current page token

### setAppToken

Sets a new app token to use for all app-level requests

**Parameters**

-   `token`  
-   `app_token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The new app token

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Updated app token

### getAppToken

Gets the current app token being used for app-level requests

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Current app token

### setApiVersion

Sets a new Graph API version to use for all requests

**Parameters**

-   `version` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The new version in the format `v2.11`

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Updated version number

### getApiVersion

Gets the current Graph API version being used for all requests

**Parameters**

-   `version`  

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Current Graph API version

### sendBroadcast

Sends a new broadcast message.

**Parameters**

-   `message_creative_id` **Integer** The ID of a message creative to send in the broadcast. Created by calling [Client.createMessageCreative()](#createmessagecreative).
-   `custom_label_id` **Integer** _Optional._ The ID of a custom label to target for the broadcast. Created by calling [Client.createCustomLabel()](#createcustomlabel).

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** The API response

### startBroadcastReachEstimation

Start a reach estimation for the number of people that will be 
reached by a broadcast to all users or to users associated with 
a custom label

**Parameters**

-   `custom_label_id` **Integer** _Optional._ The ID of a custom label targeted by the broadcast. Created by calling [Client.createCustomLabel()](#createcustomlabel).

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API Response

### getBroadcastReachEstimation

Get the current status of a broadcast reach estimation.
{@link #startbroadcastreachestimation|`startBroadcastReachEstimation` 
must be run first to get a `reach_estimation_id`.

**Parameters**

-   `reach_estimation_id` **Integer** The reach estimation ID.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API Response

### createCustomLabel

Creates a new custom label

**Parameters**

-   `name` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getCustomLabelById

Retrieves the id and name of a custom label

**Parameters**

-   `label_id` **Integer** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getCustomLabelsByPsid

Retrieves the list of custom labels associated with a PSID

**Parameters**

-   `psid` **Integer** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getAllCustomLabels

Retrieves the list of all custom labels

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### deleteCustomLabel

Deletes a custom label

**Parameters**

-   `label_id` **Integer** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### addPsidtoCustomLabel

Associates a user PSID to a custom label

**Parameters**

-   `psid` **Integer** 
-   `label_id` **Integer** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### removePsidfromCustomLabel

Removes a user PSID from a custom label

**Parameters**

-   `psid` **Integer** 
-   `label_id` **Integer** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### createMessageCreative

Creates a new message creative

**Parameters**

-   `message` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendText

Sends a text message

**Parameters**

-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `text` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendQuickReplies

Sends a text message

**Parameters**

-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `quick_replies` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `text` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** _Optional._

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendAttachment

Sends a standalone attachment, including images, audio, video, and files

**Parameters**

-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `attachment` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendTemplate

Sends a template message

**Parameters**

-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `template` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendSenderAction

Sends a sender action

**Parameters**

-   `recipient` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `sender_action` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### sendSponsoredMessage

Sends a new Sponsored Message

**Parameters**

-   `ad_account_id` **Integer** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.message_creative_id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.daily_budget` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.bid_amount` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.targeting` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getMessagingInsights

Retrieves metrics from the Messaging Insights API

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.metrics` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.since` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.until` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### generateMessengerCode

Generate a new static or parametric Messenger Code for your bot

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.ref` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.image_size` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### setMessengerProfile

Sets one or more properties of your bot's Messenger Profile

**Parameters**

-   `fields` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getMessengerProfile

Retrieves one or more properties of your bot's Messenger Profile

**Parameters**

-   `fields` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** _Optional._

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### deleteMessengerProfile

Deletes one or more properties of your bot's Messenger Profile

**Parameters**

-   `fields` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getMatchingPsids

Returns all Page-scoped IDs (PSIDs) for a user across all Pages in the same 
Facebook Business Manager account. Matches can be found using 
a PSID or ASID.

**Parameters**

-   `id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** A valid ASID or PSID
-   `id_type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The type of ID provided in the `id` argument: `ASID` or `PSID`

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getMatchingAsids

Returns all app-scoped IDs (ASIDs) for a user across all Pages in the same 
Facebook Business Manager account. Matches can be found using 
a PSID or ASID.

**Parameters**

-   `id_type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The type of ID provided in the `id` argument: `ASID` or `PSID`
-   `id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** A valid ASID or PSID

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response

### getUserProfile

Retrieves a user's profile

**Parameters**

-   `psid` **Integer** 
-   `fields` **Integer** _Optional._

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** The API response
amm-mbp:messenger-node amm$ 
