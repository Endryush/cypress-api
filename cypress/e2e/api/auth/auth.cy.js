describe('Auth API Testing', () => {
  it('POST - auth credentials success - 1st', () => {
    cy.request({
      url: '/auth',
      method: 'POST',
      body: {
        username: 'admin',
        password: 'password123'
      },
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('token').and.to.be.a('string')
      // expect(response.body).not.to.be.empty
    })
  })
})