const test = require("./pact-testing.js");
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
const { somethingLike: like, term } = Pact.Matchers

const barcode =  "9676761472500";

const expectedLoanBody = {
loans: [
  {
    id: like("cf23adf0-61ba-4887-bf82-956c4aae2260"),
    userId : like("df7f4993-8c14-4a0f-ab63-93975ab01c76"),
    proxyUserId: like("346ad017-dac1-417d-9ed8-0ac7eeb886aa"),
    itemId : like("cb20f34f-b773-462f-a091-b233cc96b9e6"),
    item : {
      title: like("The Long Way to a Small, Angry Planet"),
      barcode: like("9676761472500"),
      status : {
        name: "Checked Out" //TODO put in options for this
      }
    },
    loanDate: like("2017-03-01T22:34:11Z"),
    dueDate: like("2017-04-01T22:34:11.000Z"),
    status: {
      name: "Open" //TODO put in options for this
    },
    location: {
      name: like("Main Library")
    },
    action: "checkedout", //TODO put in options for this
    renewalCount: like(1)
  }
],
totalRecords: 1
}
  
describe( 'Loan Pact tests', () => {
  const provider = new Pact.PactWeb({
      consumer: 'ui-checkin',
      provider: 'mod-circulation', 
      port : 9130
    }); 
 
//describe("base interaction" , () => {
  before(function(done){
    // required for slower Travis CI environment
    setTimeout(function () {
      done()
    }, 1000)
    
    })
  describe("Fetch Loan interaction", function() {
    before(function() {
      return provider.addInteraction({
        given:'A loan exists',
        uponReceiving: 'a request for Loan data',
        withRequest: {
          method: 'GET',
          path: '/circulation/loans/'+barcode,
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
      test('/circulation/loans/', barcode).then((res) => {
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
    console.log("after triggered")
    return provider.finalize() 
  })

})