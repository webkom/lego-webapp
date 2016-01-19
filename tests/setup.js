import expect from 'expect';
import expectJSX from 'expect-jsx';
import { jsdom } from 'jsdom';

expect.extend(expectJSX);

require.extensions['.css'] = () => {};
require.extensions['.png'] = () => {};

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
