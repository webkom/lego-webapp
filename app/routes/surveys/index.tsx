import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import AddSubmissionRoute from './AddSubmissionRoute';
import AddSurveyRoute from './AddSurveyRoute';
import EditSurveyRoute from './EditSurveyRoute';
import SubmissionsPublicResultsRoute from './SubmissionsPublicResultsRoute';
import SubmissionsRoute from './SubmissionsRoute';
import SurveyDetailRoute from './SurveyDetailRoute';
import SurveyRoute from './SurveyRoute';
import TemplatesRoute from './TemplatesRoute';
import SubmissionIndividual from './components/Submissions/SubmissionIndividual';
import SubmissionSummary from './components/Submissions/SubmissionSummary';

const surveysRoute = ({
  match,
}: {
  match: {
    path: string;
  };
}) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={SurveyRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/add`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={AddSurveyRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/templates`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={TemplatesRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:surveyId`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={SurveyDetailRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:surveyId/edit`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={EditSurveyRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:surveyId/answer`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={AddSubmissionRoute}
        />
        <Route path={`${match.path}/:surveyId/submissions`}>
          {({ match, location }) => (
            <SubmissionsRoute
              {...{
                match,
                currentUser,
                loggedIn,
                location,
              }}
            >
              {(props) => (
                <>
                  <RouteWrapper
                    exact
                    path={`${match.path}/summary`}
                    passedProps={{
                      currentUser,
                      loggedIn,
                      ...props,
                    }}
                    Component={SubmissionSummary}
                  />
                  <RouteWrapper
                    exact
                    path={`${match.path}/individual`}
                    passedProps={{
                      currentUser,
                      loggedIn,
                      ...props,
                    }}
                    Component={SubmissionIndividual}
                  />
                </>
              )}
            </SubmissionsRoute>
          )}
        </Route>
        <Route
          exact
          path={`${match.path}/:surveyId/results`}
          component={SubmissionsPublicResultsRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Surveys() {
  return <Route path="/surveys" component={surveysRoute} />;
}
