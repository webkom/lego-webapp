import { Route, Switch } from 'react-router-dom';
import LendableObjectDetail from 'app/routes/lending/LendableObjectDetail';
import LendableObjectsList from 'app/routes/lending/LendableObjectsList';
import PageNotFound from 'app/routes/pageNotFound';

const lendingRoute = ({
  match,
}: {
  match: {
    path: string;
  };
}) => (
  <Switch>
    <Route exact path={`${match.path}`} component={LendableObjectsList} />
    <Route
      exact
      path={`${match.path}/:lendableObjectId`}
      component={LendableObjectDetail}
    />
    <Route component={PageNotFound} />
  </Switch>
);

export default function Lending() {
  return <Route path="/lending" component={lendingRoute} />;
}
