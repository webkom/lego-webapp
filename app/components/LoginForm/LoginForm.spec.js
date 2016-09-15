import React from 'react';
import LoginForm from '../LoginForm';
import { mount, shallow } from 'enzyme';

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

    it('should call login() only if valid', () => {
      const login = jest.fn();
      const wrapper = mount(<LoginForm login={login} />);
      const form = wrapper.find('form');
      const username = wrapper.ref('username');
      const password = wrapper.ref('password');

      username.node.value = 'webkom';
      password.node.value = 'webkom';
      form.simulate('submit');
      expect(login).toBeCalled();

      username.node.value = '';
      password.node.value = '';
      form.simulate('submit');
      expect(login.mock.calls.length).toEqual(1);
    });
  });
});
