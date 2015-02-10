import React from 'react';
import Router from 'react-router';
import moment from 'moment';
import routes from './routes';

require('react-a11y')();
require('moment/locale/nb');

moment.locale('nb');

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  React.render(
    <Handler params={state.params} query={state.query} />,
    document.getElementById('app')
  );
});
