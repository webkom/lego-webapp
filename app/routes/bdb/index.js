// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import BdbRoute from './BdbRoute';
import AddCompanyRoute from './AddCompanyRoute';
import BdbDetailRoute from './BdbDetailRoute';
import EditCompanyRoute from './EditCompanyRoute';
import AddSemesterRoute from './AddSemesterRoute';
import AddCompanyContactRoute from './AddCompanyContactRoute';
import EditCompanyContactRoute from './EditCompanyContactRoute';
import MatchType from 'app/models';

const bdbRoute = ({ match }: { match: MatchType }) => (
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
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Quotes() {
  return <Route path="/bdb" component={bdbRoute} />;
}
