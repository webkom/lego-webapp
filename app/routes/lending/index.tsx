import { Route, Switch } from 'react-router-dom';
import LendableObjectDetail from 'app/routes/lending/LendableObjectDetail';
import LendableObjectEdit from 'app/routes/lending/LendableObjectEdit';
import LendableObjectsList from 'app/routes/lending/LendableObjectsList';
import PageNotFound from 'app/routes/pageNotFound';
import LendableObjectAdminDetail from './LendableObjectAdminDetail';
import LendableObjectsAdmin from './LendableObjectsAdmin';

const lendingRoute = ({
  match,
}: {
  match: {
    path: string;
  };
}) => (
  <Switch>
    <Route exact path={`${match.path}`} component={LendableObjectsList} />
    <Route exact path={`${match.path}/create`} component={LendableObjectEdit} />
    <Route
      exact
      path={`${match.path}/:lendableObjectId/edit`}
      component={LendableObjectEdit}
    />
    <Route
      exact
      path={`${match.path}/approve`}
      component={LendableObjectsAdmin}
    />
    <Route
      exact
      path={`${match.path}/approve/:lendableObjectId`}
      component={LendableObjectAdminDetail}
    />
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
