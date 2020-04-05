// @flow
import * as React from 'react';
import { UserContext } from 'app/routes/app/AppRoute';
import CompaniesRoute from './CompaniesRoute';
import CompanyDetailRoute from './CompanyDetailRoute';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import PageNotFound from '../pageNotFound';

const CompanyRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          Component={CompaniesRoute}
          passedProps={{ currentUser, loggedIn }}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:companyId`}
          Component={CompanyDetailRoute}
          passedProps={{ currentUser, loggedIn }}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Companies() {
  return <Route path="/companies" component={CompanyRoute} />;
}
