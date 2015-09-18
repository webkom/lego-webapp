import React from 'react';
import { IndexRoute, Route } from 'react-router';
import AppContainer from './containers/AppContainer';
import EventsContainer from './containers/EventsContainer';
import UserContainer from './containers/UserContainer';
import Overview from './components/Overview';
import SettingsContainer from './containers/SettingsContainer';

const routes = (
  <Route path='/' component={AppContainer}>
    <IndexRoute component={Overview} />
    <Route path='events' component={EventsContainer}  />
    <Route path='users/me' component={UserContainer} />
    <Route path='users/me/settings' component={SettingsContainer} />
    <Route path='users/:username' component={UserContainer} />
  </Route>
);

export default routes;
