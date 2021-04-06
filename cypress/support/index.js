import './commands';

Cypress.on('uncaught:exception', (err, runnable, promise) => {
  console.log(err.payload.response.status);
  if (promise && err.payload && err.payload.response.status == 404) {
    return false;
  }
});
