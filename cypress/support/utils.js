// CSS Selector to match classnames by their prefix
export const c = classname => `[class*="${classname}"]`;

export const field = name => cy.get(`[name="${name}"]`);

export const fieldError = name => cy.get(`[data-error-field-name="${name}"`);
