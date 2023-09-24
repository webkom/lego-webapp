import { useRouteMatch, Route, Switch } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import SearchPageWrapper from './SearchPageWrapper';

const SearchRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={SearchPageWrapper} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Quotes() {
  return <Route path="/search" component={SearchRoute} />;
}
