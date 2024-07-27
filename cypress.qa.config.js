const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://restful-booker.herokuapp.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      requestMode: true,
      auth_url: '/auth',
      booking_url: '/booking'
    }
  },
});
