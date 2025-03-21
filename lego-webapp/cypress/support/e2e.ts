import './commands';

Cypress.on('uncaught:exception', (err, _, promise) => {
  if (promise && err.payload && err.payload.response.status === 404) {
    return false;
  }
});
