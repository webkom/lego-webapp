// @flow
import BrandPage from './components/BrandPage';
import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import PageNotFound from '../pageNotFound';
import MatchType from 'app/models';

const brandRoute = ({ match }: { match: MatchType }) => (
  <Switch>
    <Route exact path={`${match.path}`} component={BrandPage} />
    <Route component={PageNotFound} />
  </Switch>
);

export default function Brand() {
  return <Route path="/brand" component={brandRoute} />;
}
