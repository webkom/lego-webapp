import React from 'react';
import { shallow } from 'enzyme';
import Button from '../Button';

describe('components', () => {
  describe('ui/Button', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<Button/>);
      expect(wrapper).to.have.attr('type', 'button');
      expect(wrapper).to.have.className('Button');
    });

    it('should support multiple variants', () => {
      const props = {
        size: 'large'
      };
      const wrapper = shallow(<Button {...props} />);
      expect(wrapper).to.have.className(`Button--${props.size}`);
    });

    it('should be a normal button by default', () => {
      const wrapper = shallow(<Button/>);
      expect(wrapper).to.have.attr('type', 'button');
    });

    it('should turn to a submit button with a flag', () => {
      const wrapper = shallow(<Button submit='true' />);
      expect(wrapper).to.have.attr('type', 'submit');
    });
  });
});
