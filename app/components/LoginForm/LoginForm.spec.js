import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Field } from 'redux-form';
import configureStore from 'redux-mock-store';

import LoginForm from './LoginForm';

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
      const form = wrapper.find('form');
      expect(form.hasClass('LoginForm')).toBe(true);

      const username = form.childAt(0);
      const password = form.childAt(1);
      const submit = form.childAt(2);

      expect(username.type()).toEqual(Field);
      expect(password.type()).toEqual(Field);
      expect(password.prop('type')).toBe('password');
      expect(submit.prop('submit')).toBe(true);
    });
  });
});
