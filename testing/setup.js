import moment from 'moment';
import { jsdom } from 'jsdom';
import sinon from 'sinon';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';

moment.locale('nb-NO');

require.extensions['.css'] = () => {};
require.extensions['.png'] = () => {};

chai.use(chaiEnzyme());
chai.use(sinonChai);

moment.locale('nb-NO');

global.sinon = sinon;
global.expect = chai.expect;
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
