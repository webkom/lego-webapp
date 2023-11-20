import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import JoblistingDetail from './components/JoblistingDetail';
import JoblistingEditor from './components/JoblistingEditor';
import JoblistingsPage from './components/JoblistingPage';

const JobListingRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={path} component={JoblistingsPage} />
      <CompatRoute path={`${path}/create`} component={JoblistingEditor} />
      <CompatRoute
        exact
        path={`${path}/:joblistingIdOrSlug`}
        component={JoblistingDetail}
      />
      <CompatRoute
        path={`${path}/:joblistingId/edit`}
        component={JoblistingEditor}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Joblistings() {
  return <Route path="/joblistings" component={JobListingRoute} />;
}
