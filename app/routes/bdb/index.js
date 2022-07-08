// @flow
import { Route, Switch } from 'react-router-dom';

import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import AddCompanyContactRoute from './AddCompanyContactRoute';
import AddCompanyRoute from './AddCompanyRoute';
import AddSemesterRoute from './AddSemesterRoute';
import BdbDetailRoute from './BdbDetailRoute';
import BdbRoute from './BdbRoute';
import EditCompanyContactRoute from './EditCompanyContactRoute';
import EditCompanyRoute from './EditCompanyRoute';

const bdbRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ loggedIn }}
          Component={BdbRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/add`}
          passedProps={{ loggedIn }}
          Component={AddCompanyRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:companyId`}
          passedProps={{ currentUser, loggedIn }}
          Component={BdbDetailRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:companyId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={EditCompanyRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:companyId/semesters/add`}
          passedProps={{ loggedIn }}
          Component={AddSemesterRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:companyId/company-contacts/add`}
          passedProps={{ currentUser, loggedIn }}
          Component={AddCompanyContactRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:companyId/company-contacts/:companyContactId`}
          passedProps={{ currentUser, loggedIn }}
          Component={EditCompanyContactRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Quotes() {
  return <Route path="/bdb" component={bdbRoute} />;
}
