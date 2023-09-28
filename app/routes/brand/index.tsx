import { useRouteMatch, Route, Switch } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import BrandPage from './components/BrandPage';

const BrandRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={BrandPage} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default BrandRoute;
