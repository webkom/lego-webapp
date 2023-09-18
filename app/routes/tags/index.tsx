import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import TagCloud from './components/TagCloud';
import TagDetail from './components/TagDetail';

const TagsRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={path} component={TagCloud} />
      <CompatRoute exact path={`${path}/:tagId`} component={TagDetail} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default TagsRoute;
