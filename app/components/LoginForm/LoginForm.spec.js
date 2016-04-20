/* eslint-disable-rule no-unused-expressions */
import React from 'react';

import LoginForm from '../LoginForm';
import Button from '../Button';
import { mount, shallow } from 'enzyme';

describe('components', () => {
  describe('LoginForm', () => {
    it('should render correctly', () => {
      const login = () => {};
      const wrapper = shallow(<LoginForm login={login} />);
      expect(wrapper).to.tagName('div');
      expect(wrapper).to.have.prop('className', 'LoginForm');
      const form = wrapper.find('form');
      const username = form.children().at(0);
      const password = form.children().at(1);
      const submit = form.children().at(2);
      expect(username).to.tagName('input');
      expect(username).to.have.prop('autoFocus')
      expect(password).to.tagName('input');
      expect(password).to.have.attr('type','password');
      expect(submit).to.have.match(Button);
      expect(submit).to.have.prop('submit');

    });

    it('should call login() only if valid', () => {
      const login = sinon.spy();
      const wrapper = mount(<LoginForm login={login} />);
      const form = wrapper.find('form');
      const username = wrapper.ref('username');
      const password = wrapper.ref('password');

      username.node.value = 'webkom';
      password.node.value = 'webkom';
      form.simulate('submit');
      expect(login).to.have.been.called;

      username.node.value = '';
      password.node.value = '';
      form.simulate('submit');
      expect(login).to.have.callCount(1);
    });
  });
});
