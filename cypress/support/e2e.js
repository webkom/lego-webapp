import './commands';

Cypress.on('uncaught:exception', (err, runnable, promise) => {
  if (promise && err.payload && err.payload.response.status === 404) {
    return false;
  }
});
