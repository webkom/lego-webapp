import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import ArticleCreateRoute from './ArticleCreateRoute';
import ArticleDetailRoute from './ArticleDetailRoute';
import ArticleEditRoute from './ArticleEditRoute';
import ArticleListRoute from './ArticleListRoute';

const articleRoute = ({
  match,
}: {
  match: {
    path: string;
  };
}) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={ArticleListRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/new`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={ArticleCreateRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:articleIdOrSlug`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={ArticleDetailRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:articleId/edit`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
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
