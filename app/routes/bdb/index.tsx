import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import AddSemester from './components/AddSemester';
import BdbDetail from './components/BdbDetail';
import BdbPage from './components/BdbPage';
import CompanyContactEditor from './components/CompanyContactEditor';
import CompanyEditor from './components/CompanyEditor';

const BdbRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={`${path}`} component={BdbPage} />
      <CompatRoute exact path={`${path}/add`} component={CompanyEditor} />
      <CompatRoute exact path={`${path}/:companyId`} component={BdbDetail} />
      <CompatRoute
        exact
        path={`${path}/:companyId/edit`}
        component={CompanyEditor}
      />
      <CompatRoute
        exact
        path={`${path}/:companyId/semesters/add`}
        component={AddSemester}
      />
      <CompatRoute
        exact
        path={`${path}/:companyId/company-contacts/add`}
        component={CompanyContactEditor}
      />
      <CompatRoute
        exact
        path={`${path}/:companyId/company-contacts/:companyContactId`}
        component={CompanyContactEditor}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Quotes() {
  return <Route path="/bdb" component={BdbRoute} />;
}
