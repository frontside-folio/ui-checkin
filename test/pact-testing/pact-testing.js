
objectUnderTest = require("../../src/Scan.js")
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from '../helpers/describe-application';
import CheckInInteractor from '../interactors/check-in';


const provider = pact({
    consumer: 'ui-checkin',
    provider: 'mod-loans',
    port: API_PORT,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: LOG_LEVEL,
    spec: 3
  })
  const barcode =  "9676761472500";
  const loanId = "asdasdasdasd";
  const expectedLoanBody = {
    items : ["blah","blah"],
  }
describeApplication( 'Pact Checkin', () => {
  const item;
    beforeEach(() => {
      
      this.server.create('item', 'withLoan', {
        barcode: 9676761472500,
        title: 'Best Book Ever',
        materialType: {
          name: 'book'
        }
      });
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
      

    it('can retrieve the item by barcode from the provider by id', done => {

       item = objectUnderTest.fetchItemByBarcode(barcode);
      
    } )
    it("can retrieve the loan by id", done => {
     const response =  objectUnderTest.fetchLoanById(loanId);
      
      expect(response).to.eventually.have.property('items');
    })
    after(() => {
      return provider.finalize()
    })
})