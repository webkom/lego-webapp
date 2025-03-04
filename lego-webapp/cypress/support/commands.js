import { apiBaseUrl } from './utils.js';

Cypress.Commands.add('waitForHydration', () => {
  cy.get('[data-hydrated="true"]').should('exist');
});

Cypress.Commands.add(
  'getAuthToken',
  (username = 'webkom', password = 'Webkom123') => {
    const url = apiBaseUrl + '/authorization/token-auth/';
    return cy
      .request({
        method: 'POST',
        url: url,
        body: { username, password },
      })
      .its('body')
      .then((body) => body.token);
  },
);

Cypress.Commands.add('setAuthToken', (token) =>
  cy.setCookie('lego.auth', token),
);

Cypress.Commands.add('login', (username = 'webkom', password = 'Webkom123') =>
  cy.getAuthToken(username, password).then(cy.setAuthToken),
);

const cachedTokens = {};

// We can cache auth tokens between runs because they are JWT, so a DB reset should not affect them
// Use login instead of you change passwords and want to see that login works or if you are doing
// anything else that might be affected by caching.
Cypress.Commands.add(
  'cachedLogin',
  (username = 'webkom', password = 'Webkom123') => {
    if (cachedTokens[username]) {
      cy.log('cached token found');
      return cy.setAuthToken(cachedTokens[username]);
    }
    return cy.getAuthToken(username, password).then((token) => {
      cachedTokens[username] = token;
      return cy.setAuthToken(token);
    });
  },
);

Cypress.Commands.add(
  'upload_file',
  (selector, fileName, type = 'image/png') => {
    return cy.fixture(fileName, 'base64').then((str) => {
      const blob = Cypress.Blob.base64StringToBlob(str);
      const nameSegments = fileName.split('/');
      const name = nameSegments[nameSegments.length - 1];
      const testFile = new File([blob], name, { type });
      const event = { dataTransfer: { files: [testFile], types: ['Files'] } };
      return cy.get(selector).first().trigger('drop', event);
    });
  },
);

Cypress.Commands.add('resetDb', () => {
  const resetDbApi = Cypress.env('RESET_DB_API') || 'http://localhost:3030';
  return cy.request({
    method: 'POST',
    url: resetDbApi,
  });
});

Cypress.Commands.overwrite('type', (originalFn, subject, string, options) =>
  originalFn(subject, string, Object.assign({}, options, { delay: 1 })),
);

// Commands for interacting with iframes
Cypress.Commands.add('getIframeBody', (selector) => {
  return cy
    .get(selector)
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
});

Cypress.Commands.add(
  'findIframeBody',
  { prevSubject: true },
  (subject, selector) => {
    return cy
      .wrap(subject)
      .find(selector, { timeout: 6000 })
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap);
  },
);

Cypress.Commands.add('apiRequest', (options, username = 'webkom') => {
  const token = cachedTokens[username];

  return cy.request({
    ...options,
    url: apiBaseUrl + options.url,
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
});
