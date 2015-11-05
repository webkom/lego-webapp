import React from 'react';
import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import Button from '../Button';

function setup(props = {}) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<Button {...props} />);
  const output = renderer.getRenderOutput();
  return { props, output, renderer };
}

describe('components', () => {
  describe('ui/Button', () => {
    it('should render correctly', () => {
      const { output } = setup();
      expect(output.type).toBe('button');
      expect(output.props.className).toInclude('Button');
    });

    it('should support multiple variants', () => {
      const { props, output } = setup({ size: 'large' });
      expect(output.props.className).toInclude(`Button--${props.size}`);
    });

    it('should be a normal button by default', () => {
      const { output } = setup();
      expect(output.props.type).toBe('button');
    });

    it('should turn to a submit button with a flag', () => {
      const { output } = setup({ submit: true });
      expect(output.props.type).toBe('submit');
    });
  });
});
