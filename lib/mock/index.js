function Mock (Webhook) {
  this.send = send.bind(Webhook);
}

