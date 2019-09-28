import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import ValidatorRoute from './ValidatorRoute';
import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import PageNotFound from '../pageNotFound';

const old = {
  path: 'validator',
  ...resolveAsyncRoute(() => import('./ValidatorRoute'))
};

const validatorRoute = ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} component={ValidatorRoute} />
    <Route component={PageNotFound} />
  </Switch>
);

export default function Validator() {
  return <Route path="/validator" component={validatorRoute} />;
}
