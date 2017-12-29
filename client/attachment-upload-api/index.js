function Attachment (GraphRequest) {
  this.uploadFile = uploadFile.bind(GraphRequest);
  this.uploadUrl = uploadUrl.bind(GraphRequest)
}

function uploadFile(options) {

  return this.sendGraphRequest(request_options);
}

function uploadUrl(options) {
  if (!options.type || !options.url) {
    console.error('Valid type and url required');
    return
  }

  let request_options = {
    'path': '/me/message_attachments',
    'payload': {
      'message': {
        'attachment': {
          'type': options.type,
          'payload': {
            'url': options.url,
            'is_reusable': options.is_reusable || true
          }
        }
      }
    }
  }

  return this.sendGraphRequest(request_options);
}

module.exports = Attachment;
