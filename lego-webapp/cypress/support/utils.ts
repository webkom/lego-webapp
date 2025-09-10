import mockMazemapApiResponse from '../fixtures/mockApiResponses/mazemap.json';

export const apiBaseUrl =
  Cypress.env('API_BASE_URL') || 'http://localhost:8000';

const IS_MACOS = Cypress.platform.toLowerCase().search('darwin') !== -1;
export const ctrlKey = IS_MACOS ? '{cmd}' : '{ctrl}';

export const NO_OPTIONS_MESSAGE = 'Ingen treff';

// CSS Selector to match classnames by their prefix
export const c = (classname: string) => `[class*="${classname}"]`;

// Find links by their path
export const a = (path: string) => `a[href="${path}"]`;

export const t = (testId: string) => `[data-test-id="${testId}"]`;

export const selectTab = (tabName: string) =>
  cy.get(t('tab')).contains(tabName).click();

export const field = (name: string) => cy.get(`[name="${name}"]`);

// Used for react-select elements that cannot be found with the normal field method
export const selectField = (name: string) =>
  cy
    .get(`[id="react-select-${name}-input"]`)
    .parent()
    .parent()
    .parent()
    .parent();

export const selectFieldDropdown = (name: string) =>
  cy.get(`[id=react-select-${name}-listbox]`);

export const selectFromSelectField = (
  name: string,
  option: string,
  search?: string,
) => {
  selectField(name).click();
  cy.focused().type(search ?? option, { force: true });
  selectFieldDropdown(name)
    .should('not.contain', NO_OPTIONS_MESSAGE)
    .and('contain', option);
  selectFieldDropdown(name).contains(option).click();
};

export const fieldErrors = () => cy.get(c('fieldError'));

export const fieldError = (name: string) =>
  cy.get(`[data-error-field-name="${name}"]`);

export const button = (buttonText: string) => cy.contains('button', buttonText);

export const getEditor = (name?: string) =>
  name
    ? cy.get(`${t('lego-editor')} [name="${name}"]`)
    : cy.get(t('lego-editor'));

export const getEditorToolbar = (name?: string) =>
  getEditor(name).find(t('lego-editor-toolbar'));

export const getEditorContent = () => cy.get(t('lego-editor-content'));

export const selectEditor = (name?: string) =>
  getEditor(name).find('div[contenteditable]').click();

export const setDatePickerTime = (
  name: string,
  hours: string,
  minutes: string,
  isEndTime = false,
) => {
  field(name).click();

  const timePickerIndex = isEndTime ? 3 : 0;
  cy.get(c('_timePicker'))
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

export const setDatePickerDate = (
  name: string,
  date: string | number,
  isNextMonth = false,
) => {
  field(name).click();

  if (isNextMonth) {
    cy.get(`button:not(:disabled)${c('prevOrNextMonth')}`)
      .contains(new RegExp('^' + date + '$', 'g'))
      .click();
  } else {
    cy.get(`button:not(:disabled):not(${c('prevOrNextMonth')})`)
      .contains(new RegExp('^' + date + '$', 'g'))
      .click();
  }

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

export const fillCardDetails = (
  cardNumber: string,
  expiry: string,
  cvc: string,
) => {
  cy.getIframeBody('[data-test-id="cardnumber-input"] iframe')
    .find('input[name="cardnumber"]')
    .type(cardNumber);
  cy.getIframeBody('[data-test-id="expiry-input"] iframe')
    .find('input[name="exp-date"]')
    .type(expiry);
  cy.getIframeBody('[data-test-id="cvc-input"] iframe')
    .find('input[name="cvc"]')
    .type(cvc);
};

export const clearCardDetails = () => {
  cy.getIframeBody('[data-test-id="cardnumber-input"] iframe')
    .find('input[name="cardnumber"]')
    .clear();
  cy.getIframeBody('[data-test-id="expiry-input"] iframe')
    .find('input[name="exp-date"]')
    .clear();
  cy.getIframeBody('[data-test-id="cvc-input"] iframe')
    .find('input[name="cvc"]')
    .clear();
};

export const stripeError = () => cy.get(t('stripe') + ' ' + c('_error'));

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
