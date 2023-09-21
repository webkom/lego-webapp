import { useRouteMatch, Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import Overview from 'app/routes/articles/components/Overview';
import PageNotFound from '../pageNotFound';
import ArticleDetail from './components/ArticleDetail';
import ArticleEditor from './components/ArticleEditor';

const ArticleRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <Route exact path={path} component={Overview} />
          <RouteWrapper
            exact
            path={`${path}/new`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={ArticleEditor}
          />
          <RouteWrapper
            exact
            path={`${path}/:articleIdOrSlug`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={ArticleDetail}
          />
          <RouteWrapper
            exact
            path={`${path}/:articleId/edit`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={ArticleEditor}
          />
          <Route component={PageNotFound} />
        </Switch>
      )}
    </UserContext.Consumer>
  );
};

export default function Articles() {
  return <Route path="/articles" component={ArticleRoute} />;
}
