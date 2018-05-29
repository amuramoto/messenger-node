function HandoverProtocol (GraphRequest) {
  this.passThreadControl = passThreadControl.bind(GraphRequest);
  this.takeThreadControl = takeThreadControl.bind(GraphRequest);
  this.requestThreadControl = requestThreadControl.bind(GraphRequest);
  this.getThreadOwner = getThreadOwner.bind(GraphRequest);
  this.getSecondaryReceiverList = getSecondaryReceiverList.bind(GraphRequest);

}

function passThreadControl (psid, target_app_id, metadata) {  

}

function takeThreadControl (psid, target_app_id, metadata) {  

}

function requestThreadControl (psid, metadata) {  

}

function getThreadOwner (psid) {  

}

function getSecondaryReceiverList (psid) {  

}

module.exports = HandoverProtocol;