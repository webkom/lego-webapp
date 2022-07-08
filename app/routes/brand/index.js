// @flow
import { Route, Switch } from 'react-router-dom';

import PageNotFound from '../pageNotFound';
import BrandPage from './components/BrandPage';

const brandRoute = ({ match }: { match: { path: string } }) => (
  <Switch>
    <Route exact path={`${match.path}`} component={BrandPage} />
    <Route component={PageNotFound} />
  </Switch>
);

export default function Brand() {
  return <Route path="/brand" component={brandRoute} />;
}
