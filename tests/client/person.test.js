'use strict';

const PSID = process.env.TEST_PSID,
      ASID = process.env.TEST_ASID,
      Client = require('./util/client-generator');

describe('Person', () => {

  describe('User Profile API', () => {
    test('Get user profile', done => {
      let fields = [
        'id',
        'first_name',
        'last_name',
        'profile_pic',
        'locale',
        'timezone',
        'gender',
        'last_ad_referral'
      ]
      Client.Person.getProfile(PSID, fields).then(res => {
        for (let field in res) {
          expect(fields.includes(field)).toBeTruthy();
        }
        done();
      });          
    });
  });
  
  describe('ID Matching API', () => {
    let ids = [
      {'type': 'PSID', 'id': PSID},
      {'type': 'ASID', 'id': ASID}
    ]

    ids.forEach(id => {
      test(`Get PSIDs from ${id.type}`, done => {
        Client.Person.getMatchingPsids(id.type, id.id).then(res => {
          expect(res).toHaveProperty('data');
          expect(res).toHaveProperty('paging');    
          done();
        });          
      });
      
      test(`Get ASIDs from ${id.type}`, done => {
        Client.Person.getMatchingAsids(id.type, id.id).then(res => {
          expect(res).toHaveProperty('data');
          expect(res).toHaveProperty('paging');    
          done();
        });          
      });
    })
  });
});      