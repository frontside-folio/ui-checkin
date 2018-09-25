const test = require("./pact-testing.js");
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

//import { describeApplication } from '../bigtest/helpers/describe-application';




const barcode =  "9676761472500";
const loanId = "asdasdasdasd";
const expectedLoanBody = {
  id : "asdasdfasdf",
  userid : "erqwerwe",
  item : {
    instanceid : "ryutyuityui"
  }, 
  systemReturnDate : "enter date here"
}
describe( 'Pact Checkin tests', () => {
  const provider = new Pact.PactWeb({
      consumer: 'ui-checkin',
      provider: 'mod-circulation', 
      port : 9130
    }); 
  



 
//describe("base interaction" , () => {
  before(function(done){
    console.log("before fired");
  
    // required for slower Travis CI environment
    setTimeout(function () {
      console.log("before done");
      done()
    }, 1000)
    
    })
  describe("first interaction", function() {
    before(function() {
      console.log("before add interaction fired");
      return provider.addInteraction({
        uponReceiving: 'a request for JSON data',
        withRequest: {
          method: 'GET',
          path: '/circulation/loans'
 
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: expectedLoanBody
        }
      })
      .catch(e => {
         console.log('ERROR: ', e)
       })
    })
    it("can retrieve the loan by id", function(done) {
      console.log("test started " );
      // const response = test('/circulation/loans?', `id==${loanId}`)
     
      test('/circulation/loans', "").then((res) => {
       response = res
       console.log("request recieved");
     }).then(() => {
      expect(response).to.have.property('id');
      console.log("test over");
     }).then(done)

    })
  })
  afterEach(() => {
    console.log("verify called");
    return provider.verify();
    
  })

  after(() => {
    console.log("after triggered");
    return provider.finalize()
  })

})