import { Route, Routes } from 'react-router-dom';
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

const SurveysRoute = () => (
  <Routes>
    <Route index element={<SurveyListPage />} />
    <Route path="templates" element={<SurveyListPage templates />} />
    <Route path="add" element={<AddSurveyPage />} />
    <Route path=":surveyId/edit" element={<EditSurveyPage />} />
    <Route path=":surveyId" element={<SurveyDetailPage />} />
    <Route path=":surveyId/answer" element={<AddSubmissionPage />} />
    <Route
      path=":surveyId/submissions/*"
      element={
        <SubmissionsPage>
          {(props) => (
            <Routes>
              <Route
                path="summary"
                element={<SubmissionsSummary {...props} />}
              />
              <Route
                path="individual"
                element={<SubmissionsIndividual {...props} />}
              />
            </Routes>
          )}
        </SubmissionsPage>
      }
    />
    <Route path=":surveyId/results" element={<SubmissionPublicResultsPage />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default SurveysRoute;
