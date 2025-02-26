import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme from 'enzyme';
import { defaultAppConfig } from '~/utils/appConfig';

Enzyme.configure({ adapter: new Adapter() });

window.__CONFIG__ = defaultAppConfig;
