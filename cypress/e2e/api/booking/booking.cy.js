describe('Test Suit - Booking API Testing', () => {

  beforeEach(() => {
    const bodyToken = {
      username: Cypress.env('username'),
      password: Cypress.env('password')
    }

    cy.postRequest(Cypress.env('auth_url'), bodyToken).then(response => cy.wrap(response.body.token).as('token'))
    cy.fixture('booking/bookingPost.json').then(bookingBody => cy.wrap(bookingBody).as('bookingBody'))
    cy.fixture('booking/bookingPut.json').then(bookingBody => cy.wrap(bookingBody).as('updatedBookingBody'))
  })

  it('GET all booking Ids', () => {
    cy.customGetRequest(Cypress.env('booking_url'))
      .then((response) => {
        const { body } = response
        expect(response.status).to.equal(200)
        expect(body).to.be.an('array')
        expect(body).to.have.lengthOf.at.least(1)
        expect(body[0]).to.have.property('bookingid')
      })
  })

  it('GET booking id by fistname', () => {
    cy.customGetRequest(Cypress.env('booking_url'), { 'firstName': 'test' })
      .then((response) => {
        const { body } = response
        expect(response.status).to.equal(200)
        expect(body).to.be.an('array')
        expect(body).to.have.lengthOf.at.least(1)
        expect(body[0]).to.have.property('bookingid')
      })
  })
  
  it('GET booking by id', () => {
    cy.customGetRequest(`${Cypress.env('booking_url')}/1`)
      .then((response) => {
        const { headers, body, status } = response

        expect(status).to.equal(200)
        expect(headers).to.have.property('content-type', 'application/json; charset=utf-8')
        expect(body).to.be.an('object')
        expect(body).to.have.property('firstname').and.to.be.a('string')
        expect(body).to.have.property('lastname').and.to.be.a('string')
        expect(body).to.have.property('totalprice').and.to.be.a('number')
        expect(body).to.have.property('depositpaid').and.to.be.a('boolean')
        expect(body).to.have.property('bookingdates').and.to.be.a('object')
        expect(body.bookingdates).to.have.property('checkin').and.to.be.a('string')
        expect(body.bookingdates).to.have.property('checkout').and.to.be.a('string')

      })
  })

  it('POST creating a new bookig with success', () => {
    cy.get('@bookingBody').then(bookingBody => {
      cy.postRequest(Cypress.env('booking_url'), bookingBody)
        .then((response) => {
          const { headers, body, status } = response
          expect(status).to.equal(200)
          expect(headers).to.have.property('content-type', 'application/json; charset=utf-8')
          expect(body).to.be.an('object')
          expect(body).to.have.property('bookingid').and.to.be.a('number')
          expect(body).to.have.property('booking').and.to.be.a('object')
  
          const { booking } = body 
          expect(booking).to.have.property('firstname', 'Jhon').and.to.be.a('string')
          expect(booking).to.have.property('lastname', 'Doe').and.to.be.a('string')
          expect(booking).to.have.property('totalprice').and.to.be.a('number')
          expect(booking).to.have.property('depositpaid').and.to.be.a('boolean')
          expect(booking).to.have.property('bookingdates').and.to.be.a('object')
          expect(booking.bookingdates).to.have.property('checkin').and.to.be.a('string')
          expect(booking.bookingdates).to.have.property('checkout').and.to.be.a('string')
  
          cy.wrap(response.body.bookingid).as('bookingId', { type: 'static' })
        })
    })

    cy.get('@bookingId').then(bookingId => {
      cy.customGetRequest(`${Cypress.env('booking_url')}/${bookingId}`)
          .then((response) => {
            const { headers, body: booking, status } = response

            expect(status).to.equal(200)
            expect(headers).to.have.property('content-type', 'application/json; charset=utf-8')
            expect(booking).to.be.an('object')
            expect(booking).to.have.property('firstname', 'Jhon').and.to.be.a('string')
            expect(booking).to.have.property('lastname', 'Doe').and.to.be.a('string')
            expect(booking).to.have.property('totalprice').and.to.be.a('number')
            expect(booking).to.have.property('depositpaid').and.to.be.a('boolean')
            expect(booking).to.have.property('bookingdates').and.to.be.a('object')
            expect(booking.bookingdates).to.have.property('checkin').and.to.be.a('string')
            expect(booking.bookingdates).to.have.property('checkout').and.to.be.a('string')

          })
    })
  })

  it('Update booking ID with authorization header', () => {
    cy.get('@bookingBody').then(bookingBody => {
      cy.get('@token').then(token => {
        cy.postRequest(Cypress.env('booking_url'), bookingBody)
          .then((response) => {
            const { headers, body, status } = response
            expect(status).to.equal(200)
            expect(headers).to.have.property('content-type', 'application/json; charset=utf-8')
            expect(body).to.be.an('object')
            expect(body).to.have.property('bookingid').and.to.be.a('number')
            expect(body).to.have.property('booking').and.to.be.a('object')
    
            const { booking } = body 
            expect(booking).to.have.property('firstname', 'Jhon').and.to.be.a('string')
            expect(booking).to.have.property('lastname', 'Doe').and.to.be.a('string')
            expect(booking).to.have.property('totalprice').and.to.be.a('number')
            expect(booking).to.have.property('depositpaid').and.to.be.a('boolean')
            expect(booking).to.have.property('bookingdates').and.to.be.a('object')
            expect(booking.bookingdates).to.have.property('checkin').and.to.be.a('string')
            expect(booking.bookingdates).to.have.property('checkout').and.to.be.a('string')
    
            cy.wrap(response.body.bookingid).as('bookingId', { type: 'static' })
          })
    
        cy.get('@bookingId').then(bookingId => {
          const customHeaders = {
            Accept: 'application/json',
            Cookie: `token=${token}`
          }
          cy.get('@updatedBookingBody').then(changedBody => {
            cy.customPutRequest(`${Cypress.env('booking_url')}/${bookingId}`, changedBody, customHeaders)
              .then(response => {
              const { headers, body: booking, status } = response
    
              expect(status).to.equal(200)
              expect(headers).to.have.property('content-type', 'application/json; charset=utf-8')
              expect(booking).to.be.an('object')
              expect(booking).to.have.property('firstname', 'Jhon').and.to.be.a('string')
              expect(booking).to.have.property('lastname', 'Dodoe').and.to.be.a('string')
              expect(booking).to.have.property('totalprice').and.to.be.a('number').and.equals(250)
              expect(booking).to.have.property('depositpaid').and.to.be.a('boolean')
              expect(booking).to.have.property('bookingdates').and.to.be.a('object')
              expect(booking.bookingdates).to.have.property('checkin').and.to.be.a('string')
              expect(booking.bookingdates).to.have.property('checkout').and.to.be.a('string')
              })
          })
        })
      })
    })
  })
  
  it('Update booking ID with authorization header 2 ', () => {
    cy.get('@token').then(token => {
      const initialBody = {
        firstname: 'Jhon',
        lastname: 'Doe',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: '2022-01-01',
          checkout: '2022-01-05'
        },
        additionalneeds: 'Breakfast'
      };
  
      cy.postRequest(Cypress.env('booking_url'), initialBody)
        .then(response => {
          const { headers, body, status } = response;
          expect(status).to.equal(200);
          expect(headers).to.have.property('content-type', 'application/json; charset=utf-8');
          expect(body).to.be.an('object');
          expect(body).to.have.property('bookingid').and.to.be.a('number');
          expect(body).to.have.property('booking').and.to.be.a('object');
  
          checkBookingDetails(body.booking, initialBody);
          cy.wrap(body.bookingid).as('bookingId', { type: 'static' });
        });
  
      cy.get('@bookingId').then(bookingId => {
        const customHeaders = {
          Accept: 'application/json',
          Cookie: `token=${token}`
        };
        const updatedBody = {
          firstname: 'Jhon',
          lastname: 'Dodoe',
          totalprice: 250,
          depositpaid: true,
          bookingdates: {
            checkin: '2022-01-01',
            checkout: '2022-01-05'
          },
          additionalneeds: 'Breakfast'
        };
  
        cy.customPutRequest(`${Cypress.env('booking_url')}/${bookingId}`, updatedBody, customHeaders)
          .then(response => {
            const { headers, body: booking, status } = response;
            expect(status).to.equal(200);
            expect(headers).to.have.property('content-type', 'application/json; charset=utf-8');
            checkBookingDetails(booking, updatedBody);
          });
      });
    });
  });
})


const checkBookingDetails = (booking, expectedValues) => {
  expect(booking).to.be.an('object');
  expect(booking).to.have.property('firstname', expectedValues.firstname).and.to.be.a('string');
  expect(booking).to.have.property('lastname', expectedValues.lastname).and.to.be.a('string');
  expect(booking).to.have.property('totalprice', expectedValues.totalprice).and.to.be.a('number');
  expect(booking).to.have.property('depositpaid', expectedValues.depositpaid).and.to.be.a('boolean');
  expect(booking).to.have.property('bookingdates').and.to.be.a('object');
  expect(booking.bookingdates).to.have.property('checkin', expectedValues.bookingdates.checkin).and.to.be.a('string');
  expect(booking.bookingdates).to.have.property('checkout', expectedValues.bookingdates.checkout).and.to.be.a('string');
};