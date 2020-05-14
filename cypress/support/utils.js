// CSS Selector to match classnames by their prefix
export const c = (classname) => `[class*="${classname}"]`;

// Find links by their path
export const a = (path) => `a[href="${path}"]`;

export const field = (name) => cy.get(`[name="${name}"]`);

// Used for react-select elements that cannot be found with the normal field method
export const selectField = (name) =>
  cy.get(`[id="react-select-${name}--value"]`).parent().parent();

export const fieldError = (name) => cy.get(`[data-error-field-name="${name}"`);
