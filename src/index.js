'use strict';

var React = require('react');
var Router = require('react-router');
var moment = require('moment');
var routes = require('./routes');

require('moment/locale/nb');

moment.locale('nb');

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  React.render(
    <Handler params={state.params} query={state.query} />,
    document.getElementById('app')
  );
});
