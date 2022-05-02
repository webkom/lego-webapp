// CSS Selector to match classnames by their prefix
export const c = (classname) => `[class*="${classname}"]`;

// Find links by their path
export const a = (path) => `a[href="${path}"]`;

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
  selectField(name).find(`[id=react-select-${name}-listbox]`);

export const selectFromSelectField = (name, option, search) => {
  selectField(name).click();
  cy.focused().type(search ?? option, { force: true });
  selectFieldDropdown(name)
    .should('not.contain', 'No results')
    .and('contain', option);
  cy.focused().type('{enter}', { force: true });
};

export const fieldErrors = () => cy.get(c('fieldError'));

export const fieldError = (name) => cy.get(`[data-error-field-name="${name}"`);

export const button = (buttonText) => cy.contains('button', buttonText);

export const selectEditor = (name) =>
  name
    ? cy
        .wait(500)
        .get(`[name="${name}"] div[data-slate-editor="true"]`)
        .click()
        .wait(500)
    : cy.wait(500).get('div[data-slate-editor="true"]').click().wait(500);

export const setDatePickerTime = (name, hours, minutes) => {
  field(name).click();
  cy.get(c('TimePicker__timePickerInput'))
    .first()
    .find('input')
    .click()
    .clear()
    .type(hours);

  cy.get(c('TimePicker__timePickerInput'))
    .last()
    .find('input')
    .click()
    .clear()
    .type(minutes);
  field(name).click();
};

// Used to either confirm or deny the 3D secure pop-up from Stripe.
export const confirm3DSecureDialog = (confirm = true) => {
  const target = confirm
    ? '#test-source-authorize-3ds'
    : '#test-source-fail-3ds';
  cy.getIframeBody('iframe[name^=__privateStripeFrame]')
    .findIframeBody('iframe#challengeFrame')
    .findIframeBody('iframe[name="acsFrame"]')
    .find(target)
    .click();
};

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
  cy.get('.__PrivateStripeElement iframe').then((iframe) => {
    cy.wrap(iframe.contents()[0].body)
      .find('input[name="cardnumber"]')
      .type(cardNumber);
    cy.wrap(iframe.contents()[1].body)
      .find('input[name="exp-date"]')
      .type(expiry);
    cy.wrap(iframe.contents()[2].body).find('input[name="cvc"]').type(cvc);
  });
};

export const clearCardDetails = () => {
  cy.get('.__PrivateStripeElement iframe').then((iframe) => {
    cy.wrap(iframe.contents()[0].body).find('input[name="cardnumber"]').clear();
    cy.wrap(iframe.contents()[1].body).find('input[name="exp-date"]').clear();
    cy.wrap(iframe.contents()[2].body).find('input[name="cvc"]').clear();
  });
};

export const stripeError = () => cy.get(c('Stripe__error'));
