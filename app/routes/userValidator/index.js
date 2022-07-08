// @flow
import { Route, Switch } from 'react-router-dom';

import PageNotFound from '../pageNotFound';
import ValidatorRoute from './ValidatorRoute';

const validatorRoute = ({ match }: { match: { path: string } }) => (
  <Switch>
    <Route exact path={`${match.path}`} component={ValidatorRoute} />
    <Route component={PageNotFound} />
  </Switch>
);

export default function Validator() {
  return <Route path="/validator" component={validatorRoute} />;
}
