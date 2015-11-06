import React from 'react';
import { IndexRedirect, IndexRoute, Route } from 'react-router';
import AppContainer from './containers/AppContainer';
import EventsContainer from './containers/EventsContainer';
import EventPageContainer from './containers/EventPageContainer';
import UserContainer from './containers/UserContainer';
import OverviewContainer from './containers/OverviewContainer';
import SettingsContainer from './containers/SettingsContainer';
import EventCalendar from './components/EventCalendar';
import GroupPageContainer from './containers/GroupPageContainer';
import AdminContainer from './containers/AdminContainer';
import AdminOverview from './components/AdminOverview';
import GroupViewContainer from './containers/GroupViewContainer';
import GroupSettings from './components/GroupSettings';
import GroupMembers from './components/GroupMembers';

const Test = () => {
  return <div>Select a group</div>;
};

const routes = (
  <Route path='/' component={AppContainer}>
    <IndexRoute component={OverviewContainer} />
    <Route path='events' component={EventsContainer}>
      <IndexRoute component={EventCalendar} />
      <Route path=':eventId' component={EventPageContainer} />
    </Route>
    <Route path='users/me' component={UserContainer} />
    <Route path='users/me/settings' component={SettingsContainer} />
    <Route path='users/:username' component={UserContainer} />
    <Route path='admin' component={AdminContainer}>
      <IndexRoute component={AdminOverview}/>
      <Route path='groups' component={GroupPageContainer}>
        <IndexRoute component={Test} />
        <Route path=':groupId' component={GroupViewContainer}>
          <Route path='settings' component={GroupSettings} />
          <Route path='members' component={GroupMembers} />
          <IndexRedirect to='settings' />
        </Route>
      </Route>
    </Route>
  </Route>
);

export default routes;
