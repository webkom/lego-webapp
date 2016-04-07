import React from 'react';
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
      expect(output.type).to.equal('button');
      expect(output.props.className).to.include('Button');
    });

    it('should support multiple variants', () => {
      const { props, output } = setup({ size: 'large' });
      expect(output.props.className).to.include(`Button--${props.size}`);
    });

    it('should be a normal button by default', () => {
      const { output } = setup();
      expect(output.props.type).to.equal('button');
    });

    it('should turn to a submit button with a flag', () => {
      const { output } = setup({ submit: true });
      expect(output.props.type).to.equal('submit');
    });
  });
});
