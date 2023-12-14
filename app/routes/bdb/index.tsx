import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import AddCompanyContactRoute from './AddCompanyContactRoute';
import EditCompanyContactRoute from './EditCompanyContactRoute';
import AddSemester from './components/AddSemester';
import BdbDetail from './components/BdbDetail';
import BdbPage from './components/BdbPage';
import CompanyEditor from './components/CompanyEditor';

const BdbRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <CompatRoute exact path={`${path}`} component={BdbPage} />
          <CompatRoute exact path={`${path}/add`} component={CompanyEditor} />
          <CompatRoute
            exact
            path={`${path}/:companyId`}
            component={BdbDetail}
          />
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
          <RouteWrapper
            exact
            path={`${path}/:companyId/company-contacts/add`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={AddCompanyContactRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:companyId/company-contacts/:companyContactId`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={EditCompanyContactRoute}
          />
          <Route component={PageNotFound} />
        </Switch>
      )}
    </UserContext.Consumer>
  );
};

export default function Quotes() {
  return <Route path="/bdb" component={BdbRoute} />;
}
