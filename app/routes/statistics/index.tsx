import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import StatisticsRoute from 'app/routes/statistics/StatisticsRoute';
import PageNotFound from '../pageNotFound';

const statisticsRoute = ({
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
          path={match.path}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={StatisticsRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Statistics() {
  return <Route path="/statistics" component={statisticsRoute} />;
}
