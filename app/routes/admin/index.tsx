import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import Email from './email';
import GroupPage from './groups/components/GroupPage';

const AdminRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute path={`${path}/groups/:groupId`} component={GroupPage} />
      <CompatRoute path={`${path}/groups`} component={GroupPage} />
      <Route path={`${path}/email`} component={Email} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Admin() {
  return <Route path="/admin" component={AdminRoute} />;
}
