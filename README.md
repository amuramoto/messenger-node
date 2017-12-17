# Messenger Platform Node SDK

## Creating a webhook

```js
const Messenger = require('./index');
const instance = new Messenger();
const webook = instance.Webhook;
webhook.create({'verify_token':'<YOUR VERIFY TOKEN'})
```

## Subscribing to events

```js
webhook.event.on('<EVENT NAME>', (event, sender, webhook_event) => {
  // do something
});
```

For a list of available webhook events, see the [list in the Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/).
