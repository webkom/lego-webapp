import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import BrandPage from './components/BrandPage';
import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import PageNotFound from '../pageNotFound';

const old = {
  path: 'brand',
  indexRoute: resolveAsyncRoute(() => import('./components/BrandPage'))
};

const brandRoute = ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} component={BrandPage} />
    <Route component={PageNotFound} />
  </Switch>
);

export default function Brand() {
  return <Route path="/brand" component={brandRoute} />;
}
