import { Route, Switch } from 'react-router-dom';
import PageNotFound from '../../pageNotFound';
import CreateEmailListRoute from './CreateEmailListRoute';
import CreateEmailUserRoute from './CreateEmailUserRoute';
import CreateRestrictedMailRoute from './CreateRestrictedMailRoute';
import EmailListRoute from './EmailListRoute';
import EmailListsRoute from './EmailListsRoute';
import EmailUserRoute from './EmailUserRoute';
import EmailUsersRoute from './EmailUsersRoute';
import RestrictedMailRoute from './RestrictedMailRoute';
import RestrictedMailsRoute from './RestrictedMailsRoute';
import EmailRoute from './components/EmailRoute';

const groupRoute = ({
  match,
}: {
  match: {
    path: string;
  };
}) => (
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
);

export default function Email() {
  return <Route path="/admin/email" component={groupRoute} />;
}
