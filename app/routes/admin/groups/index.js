// @flow
import GroupsRoute from './GroupsRoute';
import { Route, Switch } from 'react-router-dom';
import PageNotFound from '../../pageNotFound';
import { UserContext } from 'app/routes/app/AppRoute';

const groupRoute = ({ match }: { match: { path: string } }) => (
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
