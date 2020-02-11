// @flow
import ValidatorRoute from './ValidatorRoute';
import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import PageNotFound from '../pageNotFound';
import MatchType from 'app/models';

const validatorRoute = ({ match }: { match: MatchType }) => (
  <Switch>
    <Route exact path={`${match.path}`} component={ValidatorRoute} />
    <Route component={PageNotFound} />
  </Switch>
);

export default function Validator() {
  return <Route path="/validator" component={validatorRoute} />;
}
