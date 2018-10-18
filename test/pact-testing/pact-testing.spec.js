
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import * as exampleRespnses from './expectedResponses';
import setupApplication from '../bigtest/helpers/setup-application';
import CheckInInteractor from '../bigtest/interactors/check-in';

const UserId = "5314b409-01d8-4146-860b-369af9ac2208";

describe( 'checkin ', () => {
  var masterPath = '/users';
  var queryObj = {'query': '(id==\"' + UserId + '\")'}
  setupApplication();

  const checkIn = new CheckInInteractor();
  var provider;
  before(function(done) {
     provider = new Pact.PactWeb({
      cors : true,
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

    describe.skip('entering an invalid barcode', () => {
      
      beforeEach(() => {
        return checkIn.barcode('0000000').clickEnter();
      });
  
      it('shows an error', () => {
        expect(checkIn.barcodeError).to.equal('Item with this barcode does not exist');
      });
    });
  
    describe('entering a barcode', () => {
      before(function() {
        console.log("added interaction")
        return provider.addInteraction({
          given:'A user exists',
        uponReceiving: 'a request for user data',
        withRequest: {
          method: 'GET',
          //path: '/users?query=%28id%3D%3D%22' + UserId + '%22%29',
          path: masterPath,
          query : queryObj

        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: exampleRespnses.expectedUserBody
        }
      })
      .catch(e => {
         console.log('ERROR: ', e)
       })
      });
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
  
      describe.skip('ending the session', () => {
        beforeEach(() => {
          return checkIn.endSession();
        });
  
        it('clears the list', () => {
          expect(checkIn.hasCheckedInItems).to.be.false;
        });
      });
      after(() => {
        console.log("inside verify")
        return provider.verify();
      })
    });
  
    describe('submitting the check-in without a barcode', () => {
      // before(function() {
      //   console.log("added interaction for fill out")
      //   return provider.addInteraction({
      //     given:'A user exists',
      //   uponReceiving: 'a request for user data',
      //   withRequest: {
      //     method: 'GET',
      //     path: masterPath,

      //   },
      //   willRespondWith: {
      //     status: 200,
      //     headers: {
      //       'Content-Type': 'application/json; charset=utf-8'
      //     },
      //     body: exampleRespnses.expectedUserBody
      //   }
      // }).then(() => console.log("finished add interaction for fill out"))
      // .catch(e => {
      //    console.log('ERROR: ', e)
      //  })
      // });
      beforeEach(async function () {
        this.server.create('item', 'withLoan', {
          barcode: 9676761472500,
          title: 'Best Book Ever',
          materialType: {
            name: 'book'
          }
        });
        console.log("before each part 1")
        await checkIn.clickChangeDate();
        console.log("before each part 2")
        await checkIn.processDate.fillAndBlur('04/25/2018');
        console.log("before each part 3")
        await checkIn.processTime.fillInput('4:25 PM').clickEnter();
        console.log("before each part 4")
      });
      
      it('throws the fillOut error', () => {
        console.log("fillout calling")
        expect(checkIn.fillOutError).to.equal('Please fill this out to continue');
      });
    });
  
    describe.skip('changing check-in date and time', () => {
      let body;
      before(function() {
        console.log("added interaction for fill out")
        return provider.addInteraction({
          given:'A user exists',
        uponReceiving: 'a request for user data',
        withRequest: {
          method: 'GET',
          path: masterPath,

        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: exampleRespnses.expectedUserBody
        }
      }).then(() => console.log("finished add interaction for fill out"))
      .catch(e => {
         console.log('ERROR: ', e)
       })
      });     
      beforeEach(async function () {
        this.server.put('/circulation/loans/:id', (_, request) => {
          body = JSON.parse(request.requestBody);
          return body;
        });
  
        this.server.create('item', 'withLoan', {
          barcode: 9676761472500,
          title: 'Best Book Ever',
          materialType: {
            name: 'book'
          }
        });
  
        await checkIn.clickChangeTime();
        await checkIn.processDate.fillAndBlur('04/25/2018');
        await checkIn.processTime.fillInput('4:25 PM');
        await checkIn.barcode('9676761472500').clickEnter();
      });
  
      it('changes the date and time in the payload', () => {
        expect(body.systemReturnDate).to.include('2018-04-25');
        expect(body.systemReturnDate).to.include('16:25:00');
      });
    });
  
    describe.skip('navigating to loan details', () => {
      before(function() {
        console.log("added interaction")
        return provider.addInteraction({
          given:'A user exists',
        uponReceiving: 'a request for user data',
        withRequest: {
          method: 'GET',
          path: masterPath ,

        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: exampleRespnses.expectedUserBody
        }
      })
      .catch(e => {
         console.log('ERROR: ', e)
       })
      });
      beforeEach(async function () {
        this.server.create('item', 'withLoan', {
          barcode: 9676761472500,
          title: 'Best Book Ever',
          materialType: {
            name: 'book'
          }
        });
  
        await checkIn.barcode('9676761472500').clickEnter();
        await checkIn.selectElipse();
        await checkIn.selectLoanDetails();
      });
  
      it('directs to loan details page', function () {
        const { search, pathname } = this.location;
        expect(pathname + search).to.include('/users/view/6?layer=loan&loan=6');
      });
    });
  
    describe.skip('navigating to patron details', () => {
      before(function() {
        console.log("added interaction")
        return provider.addInteraction({
          given:'A user exists',
        uponReceiving: 'a request for user data',
        withRequest: {
          method: 'GET',
          path: masterPath ,

        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: exampleRespnses.expectedUserBody
        }
      })
      .catch(e => {
         console.log('ERROR: ', e)
       })
      });
      beforeEach(async function () {
        this.server.create('item', 'withLoan', {
          barcode: 9676761472500,
          title: 'Best Book Ever',
          materialType: {
            name: 'book'
          }
        });
  
        await checkIn.barcode('9676761472500').clickEnter();
        await checkIn.selectElipse();
        await checkIn.selectPatronDetails();
      });
  
      it('directs to patron details page', function () {
        const { search, pathname } = this.location;
        expect(pathname + search).to.include('/users/view/6');
      });
    });
  
    describe.skip('navigating to item details', () => {
      before(function() {
        console.log("added interaction")
        return provider.addInteraction({
          given:'A user exists',
        uponReceiving: 'a request for user data',
        withRequest: {
          method: 'GET',
          path: masterPath ,

        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: exampleRespnses.expectedUserBody
        }
      })
      .catch(e => {
         console.log('ERROR: ', e)
       })
      });
      beforeEach(async function () {
        this.server.create('item', 'withLoan', {
          barcode: 9676761472500,
          title: 'Best Book Ever',
          materialType: {
            name: 'book'
          },
          instanceId : 'lychee',
          holdingsRecordId : 'apple'
        });
  
        await checkIn.barcode('9676761472500').clickEnter();
        await checkIn.selectElipse();
        await checkIn.selectItemDetails();
      });
  
      it('directs to item details page', function () {
        const { search, pathname } = this.location;
        expect(pathname + search).to.include('/inventory/view/lychee/apple/6');
      });
    });
  
  


  after(() => {
    console.log("after triggered")
    return provider.finalize() 
  })

})