import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PodcastListRoute from './PodcastListRoute';
import PodcastCreateRoute from './PodcastCreateRoute';
import PodcastEditRoute from './PodcastEditRoute';
import PageNotFound from '../pageNotFound';

const old = {
  path: 'podcasts',
  indexRoute: resolveAsyncRoute(() => import('./PodcastListRoute')),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(() => import('./PodcastCreateRoute'))
    },
    {
      path: ':podcastId/edit',
      ...resolveAsyncRoute(() => import('./PodcastEditRoute'))
    }
  ]
};

const podcastRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={PodcastListRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/create`}
          passedProps={{ currentUser, loggedIn }}
          Component={PodcastCreateRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:podcastId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={PodcastEditRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Podcasts() {
  return <Route path="/podcasts" component={podcastRoute} />;
}
