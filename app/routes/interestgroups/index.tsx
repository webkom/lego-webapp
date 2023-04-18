import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import InterestGroupCreateRoute from './InterestGroupCreateRoute';
import InterestGroupDetailRoute from './InterestGroupDetailRoute';
import InterestGroupEditRoute from './InterestGroupEditRoute';
import InterestGroupListRoute from './InterestGroupListRoute';

const interestGroupRoute = ({
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
          Component={InterestGroupListRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/create`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={InterestGroupCreateRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:interestGroupId`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={InterestGroupDetailRoute}
        />
        <RouteWrapper
          path={`${match.path}/:interestGroupId/edit`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={InterestGroupEditRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function InterestGroups() {
  return (
    <Route
      path={['/interest-groups', '/interestgroups']}
      component={interestGroupRoute}
    />
  );
}
