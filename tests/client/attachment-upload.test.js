'use strict';

const PSID = process.env.TEST_PSID,
      Client = require('./util/client-generator');

/* ATTACHMENT UPLOAD API TESTS */
describe('Attachment Upload API', () => {

  let attachments = [
    {'type': 'audio', 'file': __dirname + '/assets/radio.mp3'}, 
    {'type': 'video', 'file': __dirname + '/assets/dog.mov'},
    {'type': 'image', 'file': __dirname + '/assets/dog.jpg'},
    {'type': 'file', 'file': __dirname + '/assets/dog.pdf'},
    {'type': 'audio', 'url': 'https://github.com/amuramoto/messenger-node/raw/master/__tests__/client/assets/radio.mp3' }, 
    {'type': 'video', 'url': 'https://github.com/amuramoto/messenger-node/raw/master/__tests__/client/assets/dog.mov' },
    {'type': 'image', 'url': 'https://github.com/amuramoto/messenger-node/raw/master/__tests__/client/assets/dog.jpg' },
    {'type': 'file', 'url': 'https://github.com/amuramoto/messenger-node/raw/master/__tests__/client/assets/dog.pdf' }
  ];

  attachments.forEach(attachment => {
    let source = attachment.file ? 'file':'url'; 
    test(`Upload ${attachment.type} from ${source}`, done => {
      jest.setTimeout(15000);
      Client.Attachment.upload(attachment).then(res => {
        expect(res).toHaveProperty('attachment_id');
        expect(res.attachment_id).toEqual(expect.any(String));
        done();
      });    
    });
  });
});