import { configureStore } from '@reduxjs/toolkit';
import { mount } from 'enzyme';
import { Field } from 'react-final-form';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import createRootReducer from 'app/store/createRootReducer';
import LoginForm from './LoginForm';

describe('components', () => {
  describe('LoginForm', () => {
    it('should render correctly', () => {
      const store = configureStore({
        reducer: createRootReducer(),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      });

      const wrapper = mount(
        <Provider
          {...{
            store,
          }}
        >
          <LoginForm />
        </Provider>,
      );
      const form = wrapper.find('form');
      const username = form.childAt(0);
      const password = form.childAt(1);
      expect(username.type()).toEqual(Field);
      expect(password.type()).toEqual(Field);
      expect(password.prop('type')).toBe('password');
    });
  });
});
