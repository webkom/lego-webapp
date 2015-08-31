import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import RootContainer from './containers/RootContainer';
import HashHistory from 'react-router/lib/HashHistory';

moment.locale('nb-NO');

global.log = function log(self = this) {
  console.log(self);
  return this;
};

ReactDOM.render(
  <RootContainer history={new HashHistory()} />,
  document.getElementById('root')
);
