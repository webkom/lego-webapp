import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import SurveyRoute from './SurveyRoute';
import AddSurveyRoute from './AddSurveyRoute';
import TemplatesRoute from './TemplatesRoute';
import SurveyDetailRoute from './SurveyDetailRoute';
import EditSurveyRoute from './EditSurveyRoute';
import AddSubmissionRoute from './AddSubmissionRoute';
import SubmissionsRoute from './SubmissionsRoute';
import SubmissionSummary from './components/Submissions/SubmissionSummary';
import SubmissionIndividual from './components/Submissions/SubmissionIndividual';
import SubmissionsPublicResultsRoute from './SubmissionsPublicResultsRoute';

const old = {
  path: 'surveys',
  indexRoute: resolveAsyncRoute(() => import('./SurveyRoute')),
  childRoutes: [
    {
      path: 'add',
      ...resolveAsyncRoute(() => import('./AddSurveyRoute'))
    },
    {
      path: 'templates',
      ...resolveAsyncRoute(() => import('./TemplatesRoute'))
    },
    {
      path: ':surveyId',
      ...resolveAsyncRoute(() => import('./SurveyDetailRoute'))
    },
    {
      path: ':surveyId/edit',
      ...resolveAsyncRoute(() => import('./EditSurveyRoute'))
    },
    {
      path: ':surveyId/answer',
      ...resolveAsyncRoute(() => import('./AddSubmissionRoute'))
    },
    {
      path: ':surveyId/submissions',
      ...resolveAsyncRoute(() => import('./SubmissionsRoute')),
      childRoutes: [
        {
          path: 'summary',
          ...resolveAsyncRoute(() =>
            import('./components/Submissions/SubmissionSummary')
          )
        },
        {
          path: 'individual',
          ...resolveAsyncRoute(() =>
            import('./components/Submissions/SubmissionIndividual')
          )
        }
      ]
    },
    {
      path: ':surveyId/results',
      ...resolveAsyncRoute(() => import('./SubmissionsPublicResultsRoute'))
    }
  ]
};

const surveysRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn, location }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={SurveyRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/add`}
          passedProps={{ currentUser, loggedIn }}
          Component={AddSurveyRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/templates`}
          passedProps={{ currentUser, loggedIn }}
          Component={TemplatesRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:surveyId`}
          passedProps={{ currentUser, loggedIn }}
          Component={SurveyDetailRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:surveyId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={EditSurveyRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:surveyId/answer`}
          passedProps={{ currentUser, loggedIn }}
          Component={AddSubmissionRoute}
        />
        <Route path={`${match.path}/:surveyId/submissions`}>
          {({ match, location }) => (
            <SubmissionsRoute {...{ match, currentUser, loggedIn, location }}>
              <RouteWrapper
                exact
                path={`${match.path}/summary`}
                passedProps={(event, currentUser, loggedIn)}
                Component={SubmissionSummary}
              />
              <RouteWrapper
                exact
                path={`${match.path}/individual`}
                passedProps={(event, currentUser, loggedIn)}
                Component={SubmissionIndividual}
              />
            </SubmissionsRoute>
          )}
        </Route>
        <RouteWrapper
          exact
          path={`${match.path}/:surveyId/results`}
          Component={SubmissionsPublicResultsRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Surveys() {
  return <Route path="/surveys" component={surveysRoute} />;
}
