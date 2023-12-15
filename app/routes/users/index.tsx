import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import UserConfirmationForm from './components/UserConfirmation';
import UserProfile from './components/UserProfile';
import UserResetPasswordForm from './components/UserResetPassword';
import UserSettingsIndex from './components/UserSettingsIndex';

const UsersRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${path}/registration`}
        component={UserConfirmationForm}
      />
      <CompatRoute
        exact
        path={`${path}/reset-password`}
        component={UserResetPasswordForm}
      />
      <Route exact path={`${path}/:username`} component={UserProfile} />
      <Route
        path={`${path}/:username/settings`}
        component={UserSettingsIndex}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Users() {
  return <Route path="/users" component={UsersRoute} />;
}
