import { mount } from 'cypress/react';
import { Provider } from 'react-redux';
import store from '~/cypress/fixtures/store';

Cypress.Commands.add('mount', (component, options = {}) => {
  // Use the default store if one is not provided
  const { reduxStore = store(), ...mountOptions } = options;

  const wrapped = <Provider store={reduxStore}>{component}</Provider>;

  return mount(wrapped, mountOptions);
});
