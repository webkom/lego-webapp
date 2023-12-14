import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import AddCompanyContactRoute from './AddCompanyContactRoute';
import AddCompanyRoute from './AddCompanyRoute';
import AddSemesterRoute from './AddSemesterRoute';
import BdbDetailRoute from './BdbDetailRoute';
import EditCompanyContactRoute from './EditCompanyContactRoute';
import EditCompanyRoute from './EditCompanyRoute';
import BdbPage from './components/BdbPage';

const BdbRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <CompatRoute exact path={`${path}`} component={BdbPage} />
          <RouteWrapper
            exact
            path={`${path}/add`}
            passedProps={{
              loggedIn,
            }}
            Component={AddCompanyRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:companyId`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={BdbDetailRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:companyId/edit`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={EditCompanyRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:companyId/semesters/add`}
            passedProps={{
              loggedIn,
            }}
            Component={AddSemesterRoute}
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
