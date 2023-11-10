import { mount } from 'enzyme';
import { Field } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { describe, it, expect } from 'vitest';
import LoginForm from './LoginForm';

describe('components', () => {
  describe('LoginForm', () => {
    it('should render correctly', () => {
      const login = () => {};

      const mockStore = configureStore();
      const store = mockStore();
      const wrapper = mount(
        <Provider
          {...{
            store,
          }}
        >
          <LoginForm login={login} className="LoginForm" />
        </Provider>,
      );
      const form = wrapper.find('form');
      expect(form.hasClass('LoginForm')).toBe(true);
      const username = form.childAt(0);
      const password = form.childAt(1);
      expect(username.type()).toEqual(Field);
      expect(password.type()).toEqual(Field);
      expect(password.prop('type')).toBe('password');
    });
  });
});
