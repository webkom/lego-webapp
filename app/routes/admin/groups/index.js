import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import SelectGroup from './components/SelectGroup';
import GroupsRoute from './GroupsRoute';
import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import PageNotFound from '../../pageNotFound';
import { UserContext } from 'app/routes/app/AppRoute';

const old = {
  path: 'groups', // admin/groups
  indexRoute: resolveAsyncRoute(() => import('./components/SelectGroup')),
  ...resolveAsyncRoute(() => import('./GroupsRoute')),
  childRoutes: [
    {
      path: ':groupId', // admin/groups/123
      ...resolveAsyncRoute(() => import('./GroupDetailRoute')),
      childRoutes: [
        {
          path: 'settings', // admin/groups/123/settings
          ...resolveAsyncRoute(() => import('./components/GroupSettings'))
        },
        {
          path: 'members', // admin/groups/123/members
          ...resolveAsyncRoute(() => import('./components/GroupMembers'))
        },
        {
          path: 'permissions', // admin/groups/123/members
          ...resolveAsyncRoute(() => import('./components/GroupPermissions'))
        }
      ]
    }
  ]
};

const groupRoute = ({ match }) => (
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
