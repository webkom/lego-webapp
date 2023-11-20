import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import WrappedValidator from './WrappedValidator';

const ValidatorRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={path} component={WrappedValidator} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Validator() {
  return <Route path="/validator" component={ValidatorRoute} />;
}
