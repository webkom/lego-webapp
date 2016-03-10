import 'babel-polyfill';

import moment from 'moment';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import sinon from 'sinon';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

moment.locale('nb-NO');

expect.extend(expectJSX);

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();
global.window = document.defaultView;
global.navigator = global.window.navigator;

const context = require.context('../src', true, /.spec\.js$/);
context.keys().forEach(context);
