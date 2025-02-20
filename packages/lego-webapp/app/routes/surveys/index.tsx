import { Outlet, type RouteObject } from 'react-router';
import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { EventForSurvey } from '~/redux/models/Event';
import type { DetailedSurvey } from '~/redux/models/Survey';
import type { SurveySubmission } from '~/redux/models/SurveySubmission';

const SurveysOverview = lazyComponent(
  () => import('./components/SurveysOverview'),
);
const SurveyListPage = lazyComponent(
  () => import('./components/SurveyList/SurveyListPage'),
);
const SurveyTemplatesListPage = lazyComponent(
  () => import('./components/SurveyList/SurveyTemplatesListPage'),
);
const SurveysWrapper = lazyComponent(
  () => import('./components/SurveysWrapper'),
);
const SurveyDetailPage = lazyComponent(
  () => import('./components/SurveyDetail'),
);
const AddSurveyPage = lazyComponent(
  () => import('./components/SurveyEditor/AddSurveyPage'),
);
const EditSurveyPage = lazyComponent(
  () => import('./components/SurveyEditor/EditSurveyPage'),
);
const AddSubmissionPage = lazyComponent(
  () => import('./components/AddSubmission/AddSubmissionPage'),
);
const SubmissionsPage = lazyComponent(async () => {
  const module = await import('./components/Submissions/SubmissionsPage');
  const SubmissionsPage = module.default;
  return {
    default: () => (
      <SubmissionsPage>
        {({ survey, event, submissions, fetchingSubmissions }) => (
          <Outlet
            context={
              {
                survey,
                event,
                submissions,
                fetchingSubmissions,
              } satisfies SurveysRouteContext
            }
          />
        )}
      </SubmissionsPage>
    ),
  };
});
const SubmissionsSummary = lazyComponent(
  () => import('./components/Submissions/SubmissionsSummary'),
);
const SubmissionsIndividual = lazyComponent(
  () => import('./components/Submissions/SubmissionsIndividual'),
);
const SubmissionPublicResultsPage = lazyComponent(
  () => import('./components/Submissions/SubmissionPublicResultsPage'),
);

export type SurveysRouteContext = {
  survey: DetailedSurvey;
  event: EventForSurvey;
  submissions: SurveySubmission[];
  fetchingSubmissions: boolean;
};

const surveysRoute: RouteObject[] = [
  {
    path: '',
    lazy: SurveysOverview,
    children: [
      { index: true, lazy: SurveyListPage },
      { path: 'templates', lazy: SurveyTemplatesListPage },
    ],
  },
  { path: 'add', lazy: AddSurveyPage },
  { path: ':surveyId/edit', lazy: EditSurveyPage },
  { path: ':surveyId/answer', lazy: AddSubmissionPage },
  {
    path: ':surveyId',
    lazy: SurveysWrapper,
    children: [
      { index: true, lazy: SurveyDetailPage },
      {
        path: 'submissions',
        lazy: SubmissionsPage,
        children: [
          { path: 'summary', lazy: SubmissionsSummary },
          { path: 'individual', lazy: SubmissionsIndividual },
        ],
      },
    ],
  },
  { path: ':surveyId/results', lazy: SubmissionPublicResultsPage },
  { path: '*', children: pageNotFound },
];

export default surveysRoute;
