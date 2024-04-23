import loadable from '@loadable/component';
import { type RouteObject, Outlet } from 'react-router-dom';
import pageNotFound from '../pageNotFound';
import type { DetailedSurvey } from 'app/store/models/Survey';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';

const SurveyListPage = loadable(
  () => import('./components/SurveyList/SurveyListPage'),
);
const SurveyDetailPage = loadable(() => import('./components/SurveyDetail'));
const AddSurveyPage = loadable(
  () => import('./components/SurveyEditor/AddSurveyPage'),
);
const EditSurveyPage = loadable(
  () => import('./components/SurveyEditor/EditSurveyPage'),
);
const AddSubmissionPage = loadable(
  () => import('./components/AddSubmission/AddSubmissionPage'),
);
const SubmissionsPage = loadable(
  () => import('./components/Submissions/SubmissionsPage'),
);
const SubmissionsSummary = loadable(
  () => import('./components/Submissions/SubmissionsSummary'),
);
const SubmissionsIndividual = loadable(
  () => import('./components/Submissions/SubmissionsIndividual'),
);
const SubmissionPublicResultsPage = loadable(
  () => import('./components/Submissions/SubmissionPublicResultsPage'),
);

export type SurveysRouteContext = {
  submissions: SurveySubmission[];
  survey: DetailedSurvey;
};

const surveysRoute: RouteObject[] = [
  { index: true, Component: SurveyListPage },
  { path: 'templates', Component: () => <SurveyListPage templates /> },
  { path: 'add', Component: AddSurveyPage },
  { path: ':surveyId', Component: SurveyDetailPage },
  { path: ':surveyId/edit', Component: EditSurveyPage },
  { path: ':surveyId/answer', Component: AddSubmissionPage },
  {
    path: ':surveyId/submissions/*',
    Component: () => (
      <SubmissionsPage>
        {({ submissions, survey }) => (
          <Outlet
            context={{ submissions, survey } satisfies SurveysRouteContext}
          />
        )}
      </SubmissionsPage>
    ),
    children: [
      { path: 'summary', Component: SubmissionsSummary },
      { path: 'individual', Component: SubmissionsIndividual },
    ],
  },
  { path: ':surveyId/results', Component: SubmissionPublicResultsPage },
  { path: '*', children: pageNotFound },
];

export default surveysRoute;
