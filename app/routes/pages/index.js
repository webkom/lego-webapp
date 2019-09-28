import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageListRoute from './PageListRoute';
import PageCreateRoute from './PageCreateRoute';
import PageDetailRoute from './PageDetailRoute';
import PageEditRoute from './PageEditRoute';
import PageNotFound from '../pageNotFound';

const old = {
  path: 'pages/',
  component: require('./PageListRoute'),
  childRoutes: [
    {
      path: 'new',
      ...resolveAsyncRoute(() => import('./PageCreateRoute'))
    },
    {
      path: ':section',
      ...resolveAsyncRoute(() => import('./PageDetailRoute'))
    },
    {
      path: ':section/:pageSlug/edit',
      ...resolveAsyncRoute(() => import('./PageEditRoute'))
    },
    {
      path: ':section/:pageSlug',
      ...resolveAsyncRoute(() => import('./PageDetailRoute'))
    }
  ]
};

const pagesRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}/new`}
          passedProps={{ currentUser, loggedIn }}
          Component={PageCreateRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:section`}
          passedProps={{ currentUser, loggedIn }}
          Component={PageDetailRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:section/:pageSlug`}
          passedProps={{ currentUser, loggedIn }}
          Component={PageDetailRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:section/:pageSlug/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={PageEditRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Pages() {
  return <Route path="/pages" component={pagesRoute} />;
}
