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

You can also [`Webhook.emit`](#emit) events, which can be useful for testing:

```js
Webhook.emit('messaging_postbacks', event_type, sender_info, webhook_event);
```

#### Callback Arguments
| **Name** | **Type** | **Description** | **Example** |
|------|------|-------------|--------|
| event_type | Object | Contains the event type and subtype. If the webhook has no subtype, then `event_type.subtype` will be `null` | `{'type': 'messaging_handovers', 'subtype': 'pass_thread_control}` |
| sender_info | Object | Contains the ID and ID type. | `{'id': '84736289974242', 'type': 'PSID'}` |
| webhook_event | Object | The complete webhook event parsed from the `messaging` array of the received `POST` request. | For webhook event formats and details, see the [webhook event reference](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/) in the Messenger Platform docs. |