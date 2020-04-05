// @flow
import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import CompanyInterestRoute from './CompanyInterestRoute';
import CompanyInterestListRoute from './CompanyInterestListRoute';
import CompanySemesterGUIRoute from './CompanySemesterGUIRoute';
import CompanyInterestEditRoute from './CompanyInterestEditRoute';
import PageNotFound from 'app/routes/pageNotFound';

const companyInterestRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={CompanyInterestListRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/create`}
          passedProps={{ currentUser, loggedIn }}
          Component={CompanyInterestRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/semesters`}
          passedProps={{ currentUser, loggedIn }}
          Component={CompanySemesterGUIRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:companyInterestId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={CompanyInterestEditRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

const companyInterestInfoRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <RouteWrapper
        exact
        path={`${match.path}`}
        passedProps={{ currentUser, loggedIn }}
        Component={CompanyInterestRoute}
      />
    )}
  </UserContext.Consumer>
);

export function CompanyInterestNorwegian() {
  return <Route path="/interesse" component={companyInterestInfoRoute} />;
}

export function CompanyInterestEnglish() {
  return (
    <Route path="/register-interest" component={companyInterestInfoRoute} />
  );
}

export function CompanyInterest() {
  return <Route path="/companyInterest" component={companyInterestRoute} />;
}
