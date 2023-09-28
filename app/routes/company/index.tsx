import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import CompaniesPage from './components/CompaniesPage';
import CompanyDetail from './components/CompanyDetail';

const CompanyRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={path} component={CompaniesPage} />
      <CompatRoute
        exact
        path={`${path}/:companyId`}
        component={CompanyDetail}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Companies() {
  return <Route path="/companies" component={CompanyRoute} />;
}
