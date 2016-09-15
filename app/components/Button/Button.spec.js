import React from 'react';
import { shallow } from 'enzyme';
import Button from '../Button';

describe('<Button />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Button/>);
    expect(wrapper.prop('type')).toEqual('button');
    expect(wrapper.hasClass('Button')).toEqual(true);
  });

  it('should support multiple variants', () => {
    const props = { size: 'large' };
    const wrapper = shallow(<Button {...props} />);
    expect(wrapper.hasClass(`Button--${props.size}`)).toEqual(true);
  });

  it('should be a normal button by default', () => {
    const wrapper = shallow(<Button/>);
    expect(wrapper.prop('type')).toEqual('button');
  });

  it('should turn to a submit button with a flag', () => {
    const wrapper = shallow(<Button submit />);
    expect(wrapper.prop('type')).toEqual('submit');
  });
});
