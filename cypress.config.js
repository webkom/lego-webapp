const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'niikbo',
  defaultCommandTimeout: 10000,
  viewportWidth: 1000,
  viewportHeight: 1300,
  modifyObstructiveCode: false,
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
