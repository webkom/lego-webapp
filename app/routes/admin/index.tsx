import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import OverviewRoute from './OverviewRoute';

const adminRoute = ({
  match,
}: {
  match: {
    path: string;
  };
}) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          path={`${match.path}`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={OverviewRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Admin() {
  return <Route path="/admin" component={adminRoute} />;
}
