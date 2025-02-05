import loadable from '@loadable/component';
import { Page } from '@webkom/lego-bricks';
import { type RouteObject, Outlet } from 'react-router-dom';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import { LinkButton } from 'packages/lego-bricks/src/components/Button';
import pageNotFound from '../pageNotFound';
import type { EventForSurvey } from 'app/store/models/Event';
import type { DetailedSurvey } from 'app/store/models/Survey';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';

const SurveyListPage = loadable(
  () => import('./components/SurveyList/SurveyListPage'),
);
const SurveyTemplatesListPage = loadable(
  () => import('./components/SurveyList/SurveyTemplatesListPage'),
);
const SurveysWrapper = loadable(() => import('./components/SurveysWrapper'));
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

const SurveysOverview = () => {
  return (
    <Page
      title="Spørreundersøkelser"
      actionButtons={
        <LinkButton href="/surveys/add">Ny undersøkelse</LinkButton>
      }
      tabs={
        <>
          <NavigationTab href="/surveys">Undersøkelser</NavigationTab>
          <NavigationTab href="/surveys/templates" matchSubpages>
            Maler
          </NavigationTab>
        </>
      }
    >
      <Outlet />
    </Page>
  );
};

export type SurveysRouteContext = {
  survey: DetailedSurvey;
  event: EventForSurvey;
  submissions: SurveySubmission[];
  fetchingSubmissions: boolean;
};

const surveysRoute: RouteObject[] = [
  {
    path: '',
    Component: SurveysOverview,
    children: [
      { index: true, Component: SurveyListPage },
      { path: 'templates', Component: SurveyTemplatesListPage },
    ],
  },
  { path: 'add', Component: AddSurveyPage },
  { path: ':surveyId/edit', Component: EditSurveyPage },
  { path: ':surveyId/answer', Component: AddSubmissionPage },
  {
    path: ':surveyId',
    Component: SurveysWrapper,
    children: [
      { index: true, Component: SurveyDetailPage },
      {
        path: 'submissions',
        Component: () => (
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
        children: [
          { path: 'summary', Component: SubmissionsSummary },
          { path: 'individual', Component: SubmissionsIndividual },
        ],
      },
    ],
  },
  { path: ':surveyId/results', Component: SubmissionPublicResultsPage },
  { path: '*', children: pageNotFound },
];

export default surveysRoute;
