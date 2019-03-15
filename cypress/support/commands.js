Cypress.Commands.add('login', (username = 'webkom', password = 'webkom') => {
  const base = Cypress.env('API_BASE_URL') || 'http://localhost:8000';
  const url = base + '/authorization/token-auth/';
  return cy
    .request({
      method: 'POST',
      url: url,
      body: { username, password }
    })
    .its('body')
    .then(body => {
      cy.setCookie('lego.auth', body.token);
    });
});
