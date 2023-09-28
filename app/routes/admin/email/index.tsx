import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
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
            <CompatRoute
              exact
              path={`${path}/lists/new`}
              component={EmailListEditor}
            />
            <CompatRoute
              exact
              path={`${path}/lists/:emailListId`}
              component={EmailListEditor}
            />
            <CompatRoute exact path={`${path}/users`} component={EmailUsers} />
            <CompatRoute
              exact
              path={`${path}/users/new`}
              component={EmailUserEditor}
            />
            <CompatRoute
              exact
              path={`${path}/users/:emailUserId`}
              component={EmailUserEditor}
            />
            <CompatRoute
              exact
              path={`${path}/restricted`}
              component={RestrictedMails}
            />
            <CompatRoute
              exact
              path={`${path}/restricted/new`}
              component={RestrictedMailEditor}
            />
            <CompatRoute
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

export default function Email() {
  return <Route path="/admin/email" component={EmailRoute} />;
}
