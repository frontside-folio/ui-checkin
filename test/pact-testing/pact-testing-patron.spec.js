const test = require("./pact-testing.js");
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
const { somethingLike: like, term } = Pact.Matchers

const patronId = "SDFASDFASDF";
const expectedPatronBody = 
{
  totalCharges: {
    amount: like(50.0),
    isoCurrencyCode: "USD" //TODO
  },
  totalChargesCount: like(1),
  totalLoans: like(1),
  totalHolds: like(1),
  charges: [
    {
      item : {
        instanceId : like("6e024cd5-c19a-4fe0-a2cd-64ce5814c694"),
        itemId : like("7d9dfe70-0158-489d-a7ed-2789eac277b3"),
        title : like("Some Book About Something"),
        author : like("Some Guy; Another Guy")
      },
      chargeAmount : {
        amount : like(50.0),
        isoCurrencyCode : "USD"
      },
      accrualDate : like("2018-01-31T00:00:01Z"),
      state : like("Paid Partially"),
      reason : like("damage - rebinding"),
      feeFineId : like("881c628b-e1c4-4711-b9d7-090af40f6a8f")
    }
  ],
  holds: [
    {
      requestId: like("8bbac557-d66f-4571-bbbf-47a107cc1589"),
      item: {
        instanceId: like("255f82f3-5b1b-4239-93e4-ec6acf03ad9d"),
        itemId: like("26670295-716a-4f84-8f65-2ef31707c017"),
        title: like("I Want to Hold Your Hand"),
        author: like("John Lennon; Paul McCartney")
      },
      requestDate: like("2018-06-02T08:16:30Z"),
      fulfillmentPreference: like("Hold Shelf"),
      status: like("Open - Not yet filled")
    }
  ],
  loans: [
    {
      id: like("9a171a89-baca-4f1a-b2c4-d7253854864e"),
      item: {
        instanceId: like("6e024cd5-c19a-4fe0-a2cd-64ce5814c694"),
        itemId: like("7d9dfe70-0158-489d-a7ed-2789eac277b3"),
        title: like("Some Book About Something"),
        author: like("Some Guy; Another Guy")
      },
      loanDate: like("2018-06-01T11:12:00Z"),
      dueDate: like("2525-01-01T11:12:00Z"),
      overdue: like(false)
    }
  ]
}
  
describe( 'Patron Pact tests', () => {
  const provider = new Pact.PactWeb({
      consumer: 'ui-checkin',
      provider: 'mod-patron', 
      port : 9130
    }); 
 
//describe("base interaction" , () => {
  before(function(done){
    // required for slower Travis CI environment
    setTimeout(function () {
      done()
    }, 1000)
    
    })
describe("Fetch patron interaction", function() {
    before(function() {
      return provider.addInteraction({
        uponReceiving: 'a request for patron data',
        withRequest: {
          method: 'GET',
          path: '/patron/account/'+patronId,

        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: expectedPatronBody
        }
      })
      .catch(e => {
         console.log('ERROR: ', e)
       })
    })
    it("can retrieve the patron by id", function(done) {
      test('/patron/account/', patronId).then((res) => {
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