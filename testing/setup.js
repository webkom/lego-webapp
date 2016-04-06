import moment from 'moment';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import { jsdom } from 'jsdom';
import sinon from 'sinon';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';

moment.locale('nb-NO');

require.extensions['.css'] = () => {};
require.extensions['.png'] = () => {};

chai.use(chaiEnzyme());

moment.locale('nb-NO');

expect.extend(expectJSX);

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
