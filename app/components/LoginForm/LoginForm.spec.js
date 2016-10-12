import React from 'react';
import LoginForm from '../LoginForm';
import { shallow } from 'enzyme';

describe('components', () => {
  describe('LoginForm', () => {
    it('should render correctly', () => {
      const login = () => {};
      const wrapper = shallow(<LoginForm login={login} className='LoginForm' />);
      expect(wrapper.hasClass('LoginForm')).toEqual(true);

      const username = wrapper.childAt(0);
      const password = wrapper.childAt(1);
      const submit = wrapper.childAt(2);

      expect(username.type()).toEqual('input');
      expect(username.prop('autoFocus')).toEqual(true);
      expect(password.type()).toEqual('input');
      expect(password.prop('type')).toEqual('password');
      expect(submit.prop('submit')).toEqual(true);
    });
  });
});
