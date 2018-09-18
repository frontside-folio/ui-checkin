
const pact_testing = require("./pact-testing.js")
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
describe( 'Pact Checkin', () => {
  var provider; 
  

  before(function (done) {
    console.log("before fired");
    
    provider = new Pact.PactWeb({
      consumer: 'ui-checkin',
      provider: 'mod-circulation'
    })
    // required for slower Travis CI environment
    setTimeout(function () {
      done()
    }, 1000)
    console.log("provider interaction fired");
    provider.addInteraction({
         uponReceiving: 'a request for JSON data',
         withRequest: {
           method: 'GET',
           path: '/circulation/loans',
           query: {
             query: "id==" + loanId
           }
         },
         willRespondWith: {
           status: 200,
           headers: {
             'Content-Type': 'application/json; charset=utf-8'
           },
           body: expectedLoanBody
         }
       })
  })

    it("can retrieve the loan by id", done => {
      console.log("test started " );
      const response = pact_testing.test()
      console.log("request recieved");
      expect(response).to.eventually.have.property('');
      console.log("test over");
      provider.verify();
    })
    after(() => {
      console.log("after triggered");
      return provider.finalize()
    })
})