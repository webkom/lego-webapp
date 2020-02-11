// @flow
import GroupsRoute from './GroupsRoute';
import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import PageNotFound from '../../pageNotFound';
import { UserContext } from 'app/routes/app/AppRoute';
import MatchType from 'app/models';

const groupRoute = ({ match }: { match: MatchType }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <Route path={`${match.path}/:groupId?`} component={GroupsRoute} />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Groups() {
  return <Route path="/admin/groups" component={groupRoute} />;
}
