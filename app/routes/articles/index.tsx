import { useRouteMatch, Route, Switch } from 'react-router-dom';
import Overview from 'app/routes/articles/components/Overview';
import PageNotFound from '../pageNotFound';
import ArticleDetail from './components/ArticleDetail';
import ArticleEditor from './components/ArticleEditor';

const ArticleRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={Overview} />
      <Route exact path={`${path}/new`} component={ArticleEditor} />
      <Route
        exact
        path={`${path}/:articleIdOrSlug`}
        component={ArticleDetail}
      />
      <Route exact path={`${path}/:articleId/edit`} component={ArticleEditor} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default ArticleRoute;
