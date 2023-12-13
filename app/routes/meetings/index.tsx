import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import MeetingDetailWrapper from './MeetingDetailWrapper';
import MeetingEditor from './components/MeetingEditor';
import MeetingList from './components/MeetingList';

const MeetingRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`} component={MeetingList} />
      <CompatRoute path={`${path}/create`} component={MeetingEditor} />
      <Route
        exact
        path={`${path}/:meetingId`}
        component={MeetingDetailWrapper}
      />
      <CompatRoute path={`${path}/:meetingId/edit`} component={MeetingEditor} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Meetings() {
  return <Route path="/meetings" component={MeetingRoute} />;
}
