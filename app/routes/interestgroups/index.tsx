import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import InterestGroupDetail from './components/InterestGroupDetail';
import InterestGroupEdit from './components/InterestGroupEdit';
import InterestGroupList from './components/InterestGroupList';

const InterestGroupRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={path} component={InterestGroupList} />
      <CompatRoute
        exact
        path={`${path}/create`}
        component={InterestGroupEdit}
      />
      <CompatRoute
        exact
        path={`${path}/:groupId`}
        component={InterestGroupDetail}
      />
      <CompatRoute
        path={`${path}/:groupId/edit`}
        component={InterestGroupEdit}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function InterestGroups() {
  return (
    <Route
      path={['/interest-groups', '/interestgroups']}
      component={InterestGroupRoute}
    />
  );
}
