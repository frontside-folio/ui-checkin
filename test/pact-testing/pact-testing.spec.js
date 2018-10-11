
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import * as exampleRespnses from './expectedResponses';
import setupApplication from '../bigtest/helpers/setup-application';
import CheckInInteractor from '../bigtest/interactors/check-in';

const barcode =  "9676761472500";

describe( 'checkin pact tests', () => {

  setupApplication();

  const checkIn = new CheckInInteractor();
  var provider;
  before(function(done) {
     provider = new Pact.PactWeb({
      consumer: 'ui-checkin',
      provider: 'mod-circulation', 
      port : 9130
    })
    // required for slower Travis CI environment
    setTimeout(function () {
      done()
    }, 1000)
  });
 beforeEach(function () {
    this.server.createList('item', 5, 'withLoan');
    return this.visit('/checkin', () => {
      console.log("visit finished")
      expect(checkIn.$root).to.exist;
    });
  });
  console.log("checking barcode")
  it('has a barcode field', () => {
    expect(checkIn.barcodePresent).to.be.true;
  });


  describe('entering a barcode', () => {
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
          body: exampleRespnses.expectedLoanBody
        }
      })
      .catch(e => {
         console.log('ERROR: ', e)
      })
  
    
      beforeEach(function () {
        this.server.create('item', 'withLoan', {
          barcode: 9676761472500,
          title: 'Best Book Ever',
          materialType: {
            name: 'book'
          }
        });
  
        return checkIn.barcode('9676761472500').clickEnter();
      });
  
      it('displays the checked-in item', () => {
        expect(checkIn.checkedInBookTitle).to.equal('Best Book Ever (book)');
      });
  
      describe('ending the session', () => {
        beforeEach(() => {
          return checkIn.endSession();
        });
  
        it('clears the list', () => {
          expect(checkIn.hasCheckedInItems).to.be.false;
        });
      });
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