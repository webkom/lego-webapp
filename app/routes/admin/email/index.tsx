import { useRouteMatch, Route, Switch } from 'react-router-dom';
import PageNotFound from '../../pageNotFound';
import EmailListEditor from './components/EmailListEditor';
import EmailLists from './components/EmailLists';
import EmailPage from './components/EmailPage';
import EmailUserEditor from './components/EmailUserEditor';
import EmailUsers from './components/EmailUsers';
import RestrictedMailEditor from './components/RestrictedMailEditor';
import RestrictedMails from './components/RestrictedMails';

const EmailRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path}>
        <EmailPage>
          <Switch>
            <Route exact path={path} component={EmailLists} />
            <Route
              exact
              path={`${path}/lists/new`}
              component={EmailListEditor}
            />
            <Route
              exact
              path={`${path}/lists/:emailListId`}
              component={EmailListEditor}
            />
            <Route exact path={`${path}/users`} component={EmailUsers} />
            <Route
              exact
              path={`${path}/users/new`}
              component={EmailUserEditor}
            />
            <Route
              exact
              path={`${path}/users/:emailUserId`}
              component={EmailUserEditor}
            />
            <Route
              exact
              path={`${path}/restricted`}
              component={RestrictedMails}
            />
            <Route
              exact
              path={`${path}/restricted/new`}
              component={RestrictedMailEditor}
            />
            <Route
              exact
              path={`${path}/restricted/:restrictedMailId`}
              component={RestrictedMailEditor}
            />
            <Route component={PageNotFound} />
          </Switch>
        </EmailPage>
      </Route>
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default EmailRoute;
