// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PodcastListRoute from './PodcastListRoute';
import PodcastCreateRoute from './PodcastCreateRoute';
import PodcastEditRoute from './PodcastEditRoute';
import PageNotFound from '../pageNotFound';
import MatchType from 'app/models';

const podcastRoute = ({ match }: { match: MatchType }) => (
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
