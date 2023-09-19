import { useRouteMatch, Switch, Route } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import Email from './email';
import GroupPage from './groups/components/GroupPage';

const AdminRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/groups/:groupId`} component={GroupPage} />
      <Route path={`${path}/groups`} component={GroupPage} />
      <Route path={`${path}/email`} component={Email} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default AdminRoute;
