// @flow
import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import PageNotFound from '../../pageNotFound';
import { UserContext } from 'app/routes/app/AppRoute';
import EmailRoute from './components/EmailRoute';
import EmailListsRoute from './EmailListsRoute';
import CreateEmailListRoute from './CreateEmailListRoute';
import EmailListRoute from './EmailListRoute';
import EmailUsersRoute from './EmailUsersRoute';
import CreateEmailUserRoute from './CreateEmailUserRoute';
import EmailUserRoute from './EmailUserRoute';
import RestrictedMailsRoute from './RestrictedMailsRoute';
import CreateRestrictedMailRoute from './CreateRestrictedMailRoute';
import RestrictedMailRoute from './RestrictedMailRoute';
import MatchType from 'app/models';

const groupRoute = ({ match }: { match: MatchType }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <Route path={`${match.path}`}>
          <EmailRoute>
            <Switch>
              <Route exact path={`${match.path}`} component={EmailListsRoute} />
              <Route
                exact
                path={`${match.path}/lists/new`}
                component={CreateEmailListRoute}
              />
              <Route
                exact
                path={`${match.path}/lists/:emailListId`}
                component={EmailListRoute}
              />
              <Route
                exact
                path={`${match.path}/users`}
                component={EmailUsersRoute}
              />
              <Route
                exact
                path={`${match.path}/users/new`}
                component={CreateEmailUserRoute}
              />
              <Route
                exact
                path={`${match.path}/users/:emailUserId`}
                component={EmailUserRoute}
              />
              <Route
                exact
                path={`${match.path}/restricted`}
                component={RestrictedMailsRoute}
              />
              <Route
                exact
                path={`${match.path}/restricted/new`}
                component={CreateRestrictedMailRoute}
              />
              <Route
                exact
                path={`${match.path}/restricted/:restrictedMailId`}
                component={RestrictedMailRoute}
              />
              <Route component={PageNotFound} />
            </Switch>
          </EmailRoute>
        </Route>
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Email() {
  return <Route path="/admin/email" component={groupRoute} />;
}
