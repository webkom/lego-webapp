import { useRouteMatch, Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import MeetingCreateRoute from './MeetingCreateRoute';
import MeetingDetailRoute from './MeetingDetailRoute';
import MeetingEditRoute from './MeetingEditRoute';
import MeetingList from './components/MeetingList';

const MeetingRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <Route exact path={`${path}`} component={MeetingList} />
          <RouteWrapper
            path={`${path}/create`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={MeetingCreateRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:meetingId`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={MeetingDetailRoute}
          />
          <RouteWrapper
            path={`${path}/:meetingId/edit`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={MeetingEditRoute}
          />
          <Route component={PageNotFound} />
        </Switch>
      )}
    </UserContext.Consumer>
  );
};

export default function Meetings() {
  return <Route path="/meetings" component={MeetingRoute} />;
}
