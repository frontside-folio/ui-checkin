
const objectUnderTest = require("../../src/Scan.js")
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from '../bigtest/helpers/describe-application';




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
describeApplication( 'Pact Checkin', () => {
  const item;
  var  provider

  before(function (done) {
    client = example.createClient('http://localhost:1234')
    provider = new Pact.PactWeb({
      consumer: 'Karma Mocha',
      provider: 'Hello'
    })
    // required for slower Travis CI environment
    setTimeout(function () {
      done()
    }, 1000)
  })

    beforeEach(() => {
    
        return provider.setup()
          .then(() => {
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
      })
      

    it("can retrieve the loan by id", done => {
     const response =  objectUnderTest.fetchLoanById(loanId);
      
      expect(response).to.eventually.have.property('');
    })
    after(() => {
      return provider.finalize()
    })
})