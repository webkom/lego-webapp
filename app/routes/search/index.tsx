import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import SearchRoute from './SearchRoute';

const searchRoute = ({
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
          exact
          path={`${match.path}`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={SearchRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Quotes() {
  return <Route path="/search" component={searchRoute} />;
}
