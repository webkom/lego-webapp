import React from 'react';
import LoginForm from './LoginForm';
import TextInput from '../Form/TextInput';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';

describe('components', () => {
  describe('LoginForm', () => {
    it('should render correctly', () => {
      const login = () => {};
      const mockStore = configureStore();
      const store = mockStore();
      const wrapper = mount(
        <Provider {...{ store }}>
          <LoginForm login={login} className="LoginForm" />
        </Provider>
      );
      const form = wrapper.find('Form');
      expect(form.hasClass('LoginForm')).toEqual(true);

      const username = form.childAt(0);
      const password = form.childAt(1);
      const submit = form.childAt(2);

      expect(username.type()).toEqual(TextInput);
      expect(username.prop('autoFocus')).toEqual(true);
      expect(password.type()).toEqual(TextInput);
      expect(password.prop('type')).toEqual('password');
      expect(submit.prop('submit')).toEqual(true);
    });
  });
});
