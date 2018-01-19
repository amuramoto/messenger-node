'use strict';

const Client = require('./util/client-generator');

/* ATTACHMENT UPLOAD API TESTS */
describe('Attachment Upload API', () => {

  let attachments = [
    {'type': 'audio', 'source': __dirname + '/assets/radio.mp3'}, 
    {'type': 'video', 'source': __dirname + '/assets/dog.mov'},
    {'type': 'image', 'source': __dirname + '/assets/dog.jpg'},
    {'type': 'file', 'source': __dirname + '/assets/dog.pdf'},
    {'type': 'audio', 'source': 'https://github.com/amuramoto/messenger-node/raw/master/tests/client/assets/radio.mp3' }, 
    {'type': 'video', 'source': 'https://github.com/amuramoto/messenger-node/raw/master/tests/client/assets/dog.mov' },
    {'type': 'image', 'source': 'https://github.com/amuramoto/messenger-node/raw/master/tests/client/assets/dog.jpg' },
    {'type': 'file', 'source': 'https://github.com/amuramoto/messenger-node/raw/master/tests/client/assets/dog.pdf' }
  ];

  attachments.forEach(attachment => {
    let source_type = attachment.source.indexOf('https') === 0 ? 'url' : 'file';
    test(`Upload ${attachment.type} from ${source_type}`, done => {
      jest.setTimeout(20000);
      let options = attachment;
      options.is_reusable = true;
      Client.uploadAttachment(options).then(res => {
        expect(res).toHaveProperty('attachment_id');
        expect(res.attachment_id).toEqual(expect.any(String));
        done();
      });
    });
  });
});