import React from 'react';
import expect from 'expect';
import LoginForm from '../LoginForm';
import Button from '../Button';
import { mount, shallow } from 'enzyme';

describe('components', () => {
  describe('LoginForm', () => {
    it('should render correctly', () => {
      const login = () => {};
      const wrapper = shallow(<LoginForm login={login} />);
      expect(wrapper.is('div')).toBe(true);
      expect(wrapper.props().className).toInclude('LoginForm');

      const form = wrapper.find('form');
      const username = form.children().at(0);
      const password = form.children().at(1);
      const submit = form.children().at(2);
      expect(username.is('input')).toBe(true);
      expect(username.props().autoFocus).toBe(true);

      expect(password.is('input')).toBe(true);
      expect(password.props().type).toBe('password');

      expect(submit.is(Button)).toBe(true);
      expect(submit.props().submit).toBe(true);
    });

    it('should call login() only if valid', () => {
      const login = expect.createSpy();
      const wrapper = mount(<LoginForm login={login} />);
      const form = wrapper.find('form');
      const username = wrapper.ref('username');
      const password = wrapper.ref('password');

      username.node.value = 'webkom';
      password.node.value = 'webkom';
      form.simulate('submit');
      expect(login).toHaveBeenCalled();

      username.node.value = '';
      password.node.value = '';
      form.simulate('submit');
      expect(login.calls.length).toBe(1);
    });
  });
});
