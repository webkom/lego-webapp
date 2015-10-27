import React from 'react';
import { IndexRoute, Route } from 'react-router';
import AppContainer from './containers/AppContainer';
import EventsContainer from './containers/EventsContainer';
import EventPageContainer from './containers/EventPageContainer';
import UserContainer from './containers/UserContainer';
import OverviewContainer from './containers/OverviewContainer';
import SettingsContainer from './containers/SettingsContainer';

const routes = (
  <Route path='/' component={AppContainer}>
    <IndexRoute component={OverviewContainer} />
    <Route path='events' component={EventsContainer} />
    <Route path='events/:eventId' component={EventPageContainer} />
    <Route path='users/me' component={UserContainer} />
    <Route path='users/me/settings' component={SettingsContainer} />
    <Route path='users/:username' component={UserContainer} />
  </Route>
);

export default routes;
