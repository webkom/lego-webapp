import { Route, Switch, useRouteMatch } from 'react-router-dom';
import TimelinePage from 'app/routes/timeline/components/TimelinePage';
import PageNotFound from '../pageNotFound';

const TimelineRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={TimelinePage} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Timeline() {
  return <Route path="/timeline" component={TimelineRoute} />;
}
