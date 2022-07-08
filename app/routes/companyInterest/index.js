// @flow
import { Route, Switch } from 'react-router-dom';

import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from 'app/routes/pageNotFound';
import CompanyInterestEditRoute from './CompanyInterestEditRoute';
import CompanyInterestListRoute from './CompanyInterestListRoute';
import CompanyInterestRoute from './CompanyInterestRoute';
import CompanySemesterGUIRoute from './CompanySemesterGUIRoute';

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

export const CompanyInterestInfoRoute = ({
  match,
}: {
  match: { path: string },
}) => (
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

export function CompanyInterest() {
  return <Route path="/companyInterest" component={companyInterestRoute} />;
}
