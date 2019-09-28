import * as React from 'react';
import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import InterestGroupListRoute from './InterestGroupListRoute';
import InterestGroupCreateRoute from './InterestGroupCreateRoute';
import InterestGroupDetailRoute from './InterestGroupDetailRoute';
import InterestGroupEditRoute from './InterestGroupEditRoute';
import PageNotFound from '../pageNotFound';

const old = {
  path: 'interestgroups',
  indexRoute: resolveAsyncRoute(() => import('./InterestGroupListRoute')),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(() => import('./InterestGroupCreateRoute'))
    },
    {
      path: ':interestGroupId',
      ...resolveAsyncRoute(() => import('./InterestGroupDetailRoute'))
    },
    {
      path: ':interestGroupId/edit',
      ...resolveAsyncRoute(() => import('./InterestGroupEditRoute'))
    }
  ]
};

const interestGroupRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={InterestGroupListRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/create`}
          passedProps={{ currentUser, loggedIn }}
          Component={InterestGroupCreateRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:interestGroupId`}
          passedProps={{ currentUser, loggedIn }}
          Component={InterestGroupDetailRoute}
        />
        <RouteWrapper
          path={`${match.path}/:interestGroupId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={InterestGroupEditRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function InterestGroups() {
  return <Route path="/interestgroups" component={interestGroupRoute} />;
}
