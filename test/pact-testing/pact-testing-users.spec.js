const test = require("./pact-testing.js");
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
const { somethingLike: like, term } = Pact.Matchers

const UserId = "7261ecaae3a74dc68b468e12a70b1aec";
const expectedUserBody = 
{
    username: like("jhandey"),
    id: like("7261ecaae3a74dc68b468e12a70b1aec"),
    active: like(true),
    type: like("patron"),
    patronGroup: like("4bb563d9-3f9d-4e1e-8d1d-04e75666d68f"),
    meta: {
      creation_date: like("2016-11-05T0723"),
      last_login_date: like("")
    },
    personal: {
      lastName: like("Handey"),
      firstName: like("Jack"),
      email: like("jhandey@biglibrary.org"),
      phone: like("2125551212")
    }
  };
describe( 'User Pact tests', () => {
    const provider = new Pact.PactWeb({
        consumer: 'ui-checkin',
        provider: 'mod-users', 
        port : 9130
      }); 
   
  //describe("base interaction" , () => {
    before(function(done){
      // required for slower Travis CI environment
      setTimeout(function () {
        done()
      }, 1000)
      
      })
  describe("Fetch user interaction", function() {
      before(function() {
        return provider.addInteraction({
          uponReceiving: 'a request for patron data',
          withRequest: {
            method: 'GET',
            path: '/users/'+UserId,
  
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: expectedUserBody
          }
        })
        .catch(e => {
           console.log('ERROR: ', e)
         })
      })
      it("can retrieve the patron by id", function(done) {
        test('/users/', UserId).then((res) => {
         response = res
       }).then(() => {
        expect(response).to.have.property('id');
       }).then(done)
  
      })
    })
    afterEach(() => {
      return provider.verify();
    })
  
    after(() => {
      return provider.finalize()
    })
  
  })