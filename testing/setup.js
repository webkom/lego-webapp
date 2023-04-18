import util from 'util';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme from 'enzyme';

Object.defineProperty(global, 'TextEncoder', {
  value: util.TextEncoder,
});

Enzyme.configure({ adapter: new Adapter() });
