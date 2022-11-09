import { Route, Switch } from 'react-router-dom';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../../pageNotFound';
import GroupsRoute from './GroupsRoute';

const groupRoute = ({
  match,
}: {
  match: {
    path: string;
  };
}) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <Route path={`${match.path}/:groupId?`} component={GroupsRoute} />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Groups() {
  return <Route path="/admin/groups" component={groupRoute} />;
}
