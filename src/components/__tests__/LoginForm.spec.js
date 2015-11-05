import React from 'react';
import { findDOMNode } from 'react-dom';
import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import LoginForm from '../LoginForm';
import Button from '../ui/Button';

function setup(props = {}) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<LoginForm {...props} />);
  const output = renderer.getRenderOutput();
  return { props, output, renderer };
}

describe('components', () => {
  describe('LoginForm', () => {
    it('should render correctly', () => {
      const { output } = setup({ login: () => {} });
      expect(output.type).toBe('div');
      expect(output.props.className).toInclude('LoginForm');

      const [ username, password, submit ] = output.props.children.props.children;
      expect(username.type).toBe('input');
      expect(username.props.autoFocus).toBe(true);

      expect(password.type).toBe('input');
      expect(password.props.type).toBe('password');

      expect(submit.type).toBe(Button);
      expect(submit.props.submit).toBe(true);
    });

    it('should call login() only if valid', () => {
      const login = expect.createSpy();
      const output = TestUtils.renderIntoDocument(<LoginForm {...{ login }} />);
      const form = findDOMNode(output).children[0];
      const [ username, password ] = Array.from(form.children);

      username.value = 'webkom';
      password.value = 'webkom';

      TestUtils.Simulate.submit(form);
      expect(login).toHaveBeenCalled();

      username.value = '';
      password.value = '';
      TestUtils.Simulate.submit(form);
      expect(login.calls.length).toEqual(1);
    });
  });
});
