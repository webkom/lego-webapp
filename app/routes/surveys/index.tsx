import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AddSubmissionPage from 'app/routes/surveys/components/AddSubmission/AddSubmissionPage';
import SubmissionPublicResultsPage from 'app/routes/surveys/components/Submissions/SubmissionPublicResultsPage';
import SurveyDetailPage from 'app/routes/surveys/components/SurveyDetail';
import AddSurveyPage from 'app/routes/surveys/components/SurveyEditor/AddSurveyPage';
import EditSurveyPage from 'app/routes/surveys/components/SurveyEditor/EditSurveyPage';
import PageNotFound from '../pageNotFound';
import SubmissionsIndividual from './components/Submissions/SubmissionsIndividual';
import SubmissionsPage from './components/Submissions/SubmissionsPage';
import SubmissionsSummary from './components/Submissions/SubmissionsSummary';
import SurveyListPage from './components/SurveyList/SurveyListPage';

const SurveysRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} render={() => <SurveyListPage />} />
      <Route
        exact
        path={`${path}/templates`}
        render={() => <SurveyListPage templates />}
      />
      <Route exact path={`${path}/add`} render={() => <AddSurveyPage />} />
      <Route
        exact
        path={`${path}/:surveyId/edit`}
        render={() => <EditSurveyPage />}
      />
      <Route
        exact
        path={`${path}/:surveyId`}
        render={() => <SurveyDetailPage />}
      />
      <Route
        exact
        path={`${path}/:surveyId/answer`}
        render={() => <AddSubmissionPage />}
      />
      <Route
        path={`${path}/:surveyId/submissions`}
        render={() => (
          <SubmissionsPage>
            {(props) => (
              <Switch>
                <Route
                  exact
                  path={`${path}/:surveyId/submissions/summary`}
                  render={() => <SubmissionsSummary {...props} />}
                />
                <Route
                  exact
                  path={`${path}/:surveyId/submissions/individual`}
                  render={() => <SubmissionsIndividual {...props} />}
                />
              </Switch>
            )}
          </SubmissionsPage>
        )}
      />
      <Route
        exact
        path={`${path}/:surveyId/results`}
        render={() => <SubmissionPublicResultsPage />}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Surveys() {
  return <Route path="/surveys" component={SurveysRoute} />;
}
