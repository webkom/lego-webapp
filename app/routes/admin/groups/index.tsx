import { Route, Switch } from 'react-router-dom';
import PageNotFound from '../../pageNotFound';
import GroupsRoute from './GroupsRoute';

const groupRoute = ({
  match,
}: {
  match: {
    path: string;
  };
}) => (
  <Switch>
    <Route path={`${match.path}/:groupId?`} component={GroupsRoute} />
    <Route component={PageNotFound} />
  </Switch>
);

export default function Groups() {
  return <Route path="/admin/groups" component={groupRoute} />;
}
