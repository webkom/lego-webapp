import mockMazemapApiResponse from '../fixtures/mockApiResponses/mazemap.json';

export const apiBaseUrl =
  Cypress.env('API_BASE_URL') || 'http://localhost:8000';

export const NO_OPTIONS_MESSAGE = 'Ingen treff';

// CSS Selector to match classnames by their prefix
export const c = (classname) => `[class*="${classname}"]`;

// Find links by their path
export const a = (path) => `a[href="${path}"]`;

export const t = (testId) => `[data-test-id="${testId}"]`;

export const selectTab = (tabName) =>
  cy.get(t('tab')).contains(tabName).click();

export const field = (name) => cy.get(`[name="${name}"]`);

// Used for react-select elements that cannot be found with the normal field method
export const selectField = (name) =>
  cy
    .get(`[id="react-select-${name}-input"]`)
    .parent()
    .parent()
    .parent()
    .parent();

export const selectFieldDropdown = (name) =>
  cy.get(`[id=react-select-${name}-listbox]`);

export const selectFromSelectField = (name, option, search) => {
  selectField(name).click();
  cy.focused().type(search ?? option, { force: true });
  selectFieldDropdown(name)
    .should('not.contain', NO_OPTIONS_MESSAGE)
    .and('contain', option);
  cy.focused().type('{enter}', { force: true });
};

export const fieldErrors = () => cy.get(c('fieldError'));

export const fieldError = (name) => cy.get(`[data-error-field-name="${name}"`);

export const button = (buttonText) => cy.contains('button', buttonText);

export const selectEditor = (name, options = {}) =>
  name
    ? cy
        .get(`[name="${name}"] div[data-slate-editor="true"]`, options)
        .click()
        .click()
    : cy.get('div[data-slate-editor="true"]', options).click().click();

export const setDatePickerTime = (name, hours, minutes, isEndTime = false) => {
  field(name).click();

  const timePickerIndex = isEndTime ? 3 : 0;
  cy.get(c('TimePicker-module__timePicker'))
    .eq(timePickerIndex)
    .within(() => {
      cy.get(c('timePickerInput'))
        .first()
        .find('input')
        .click()
        .clear()
        .type(hours);

      cy.get(c('timePickerInput'))
        .last()
        .find('input')
        .click()
        .clear()
        .type(minutes);
    });

  // Click outside to close picker
  field(name).click();
};

export const setDatePickerDate = (name, date, isNextMonth = false) => {
  field(name).click();

  if (isNextMonth) {
    cy.get('ion-icon[name="arrow-forward-outline"]')
      .first()
      .should('not.be.disabled')
      .click();
  }

  cy.get('button:not(:disabled):not([class*="prevOrNextMonth"])')
    .contains(new RegExp('^' + date + '$', 'g'))
    .click();

  field(name).click();
};

// Used to either confirm or deny the 3D secure pop-up from Stripe.
export const confirm3DSecure2Dialog = (confirm = true) => {
  const target = confirm
    ? '#test-source-authorize-3ds'
    : '#test-source-fail-3ds';
  cy.getIframeBody('iframe[name^=__privateStripeFrame]')
    .findIframeBody('iframe#challengeFrame')
    .find(target)
    .click();
};

export const fillCardDetails = (cardNumber, expiry, cvc) => {
  cy.getIframeBody('[data-testid="cardnumber-input"] iframe')
    .find('input[name="cardnumber"]')
    .type(cardNumber);
  cy.getIframeBody('[data-testid="expiry-input"] iframe')
    .find('input[name="exp-date"]')
    .type(expiry);
  cy.getIframeBody('[data-testid="cvc-input"] iframe')
    .find('input[name="cvc"]')
    .type(cvc);
};

export const clearCardDetails = () => {
  cy.getIframeBody('[data-testid="cardnumber-input"] iframe')
    .find('input[name="cardnumber"]')
    .clear();
  cy.getIframeBody('[data-testid="expiry-input"] iframe')
    .find('input[name="exp-date"]')
    .clear();
  cy.getIframeBody('[data-testid="cvc-input"] iframe')
    .find('input[name="cvc"]')
    .clear();
};

export const stripeError = () => cy.get(c('Stripe-module__error'));

export const mockMazemapApi = () => {
  cy.intercept('GET', 'https://api.mazemap.com/search/equery/**', {
    statusCode: 200,
    body: mockMazemapApiResponse,
  });
};

export const uploadHeader = () => {
  // Intercept the upload request
  cy.intercept('POST', '/api/v1/files/').as('fileUpload');

  // Upload file
  cy.upload_file(
    c('_coverImage') + ' ' + c('_placeholderContainer') + ' > span',
    'images/screenshot.png',
  );
  cy.get('.cropper-move').click();
  cy.get(t('Modal__content'))
    .get('button')
    .contains('Last opp')
    .should('not.be.disabled')
    .click();

  // Wait for the upload request to finish and assert it was successful
  cy.wait('@fileUpload').its('response.statusCode').should('eq', 201);
};
