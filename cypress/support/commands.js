Cypress.Commands.add('login', (username = 'webkom', password = 'Webkom123') => {
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

Cypress.Commands.add(
  'upload_file',
  (selector, fileName, type = 'image/png') => {
    return cy
      .fixture(fileName, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        const nameSegments = fileName.split('/');
        const name = nameSegments[nameSegments.length - 1];
        const testFile = new File([blob], name, { type });
        const event = { dataTransfer: { files: [testFile] } };
        return cy.get(selector).trigger('drop', event);
      });
  }
);
