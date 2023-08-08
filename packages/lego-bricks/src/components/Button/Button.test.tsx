import { shallow } from 'enzyme';
import { describe, it, expect } from 'vitest';
import { Button } from './index';

describe('<Button />', () => {
  it('should render correctly and be a normal button by default', () => {
    const wrapper = shallow(<Button />);
    expect(wrapper.prop('type')).toBe('button');
  });
  it('should turn to a submit button with the "submit" flag set to true', () => {
    const wrapper = shallow(<Button submit />);
    expect(wrapper.prop('type')).toBe('submit');
  });
});
