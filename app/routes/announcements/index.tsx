import { useRouteMatch, Route, Switch } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import AnnouncementsList from './components/AnnouncementsList';

const AnnouncementsRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={AnnouncementsList} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Announcements() {
  return <Route path="/announcements" component={AnnouncementsRoute} />;
}
