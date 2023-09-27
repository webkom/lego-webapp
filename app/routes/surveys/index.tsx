import { Route, Switch, useRouteMatch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import AddSubmissionRoute from './AddSubmissionRoute';
import AddSurveyRoute from './AddSurveyRoute';
import EditSurveyRoute from './EditSurveyRoute';
import SubmissionsPublicResultsRoute from './SubmissionsPublicResultsRoute';
import SubmissionsRoute from './SubmissionsRoute';
import SurveyDetailRoute from './SurveyDetailRoute';
import SubmissionIndividual from './components/Submissions/SubmissionIndividual';
import SubmissionSummary from './components/Submissions/SubmissionSummary';
import SurveyPage from './components/SurveyList/SurveyPage';

const SurveysRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <Route exact path={path} component={SurveyPage} />
          <Route exact path={`${path}/templates`} component={SurveyPage} />
          <RouteWrapper
            exact
            path={`${path}/add`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={AddSurveyRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:surveyId/edit`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={EditSurveyRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:surveyId`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={SurveyDetailRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:surveyId/answer`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={AddSubmissionRoute}
          />
          <Route path={`${path}/:surveyId/submissions`}>
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
                      path={`${path}/summary`}
                      passedProps={{
                        currentUser,
                        loggedIn,
                        ...props,
                      }}
                      Component={SubmissionSummary}
                    />
                    <RouteWrapper
                      exact
                      path={`${path}/individual`}
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
            path={`${path}/:surveyId/results`}
            component={SubmissionsPublicResultsRoute}
          />
          <Route component={PageNotFound} />
        </Switch>
      )}
    </UserContext.Consumer>
  );
};

export default function Surveys() {
  return <Route path="/surveys" component={SurveysRoute} />;
}
