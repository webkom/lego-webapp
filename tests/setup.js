import { jsdom } from 'jsdom';

require.extensions['.css'] = () => {};
require.extensions['.png'] = () => {};

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
