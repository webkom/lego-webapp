// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import ArticleListRoute from './ArticleListRoute';
import ArticleCreateRoute from './ArticleCreateRoute';
import ArticleDetailRoute from './ArticleDetailRoute';
import ArticleEditRoute from './ArticleEditRoute';
import PageNotFound from '../pageNotFound';
import MatchType from 'app/models';

const articleRoute = ({ match }: { match: MatchType }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={ArticleListRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/new`}
          passedProps={{ currentUser, loggedIn }}
          Component={ArticleCreateRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:articleId`}
          passedProps={{ currentUser, loggedIn }}
          Component={ArticleDetailRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:articleId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={ArticleEditRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Articles() {
  return <Route path="/articles" component={articleRoute} />;
}
