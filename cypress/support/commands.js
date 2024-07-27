// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('postRequest', (endpoint, body = {}, qs = {}, customHeaders = {}) => {
  cy.request({
    method: 'POST',
    url: endpoint,
    headers: { 
      'Content-Type': 'application/json',
      ... customHeaders
     },
    body,
    qs,
    failOnStatusCode: false
  }).then(response => response)
})

Cypress.Commands.add('customGetRequest', (endpoint, qs = {}) => {
  cy.request({
    method: 'GET',
    url: endpoint,
    headers: { 
      'Content-Type': 'application/json',
     },
    qs
  }).then(response => response)
})

Cypress.Commands.add('customPutRequest', (endpoint, body, customHeaders = {}) => {
  cy.request({
    method: 'PUT',
    url: endpoint,
    headers: { 
      'Content-Type': 'application/json',
      ...customHeaders
     },
     body,
     failOnStatusCode: false
  }).then(response => response)
})