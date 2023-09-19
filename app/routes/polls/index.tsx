import { useRouteMatch, Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import PollDetail from './components/PollDetail';
import PollEditor from './components/PollEditor';
import PollsList from './components/PollsList';

const PollsRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ loggedIn }) => (
        <Switch>
          <Route exact path={path} component={PollsList} />
          <Route exact path={`${path}/new`} component={PollEditor} />
          <RouteWrapper
            exact
            path={`${path}/:pollsId`}
            passedProps={{ loggedIn }}
            Component={PollDetail}
          />
          <Route component={PageNotFound} />
        </Switch>
      )}
    </UserContext.Consumer>
  );
};

export default PollsRoute;
