import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import PollDetail from './components/PollDetail';
import PollEditor from './components/PollEditor';
import PollsList from './components/PollsList';

const PollsRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={PollsList} />
      <CompatRoute exact path={`${path}/new`} component={PollEditor} />
      <Route exact path={`${path}/:pollsId`} component={PollDetail} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default PollsRoute;
