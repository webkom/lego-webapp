import { LoadingPage, Page, PageCover } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Outlet, useParams } from 'react-router';
import { useAppSelector } from '~/redux/hooks';
import { useFetchedSurveySubmissions } from '~/redux/slices/surveySubmissions';
import { useFetchedSurvey } from '~/redux/slices/surveys';
import { SurveyDetailTabs } from '../utils';
import type { SurveysRouteContext } from 'app/routes/surveys';

type Params = {
  surveyId: string;
};

const SurveysWrapper = () => {
  const { surveyId } = useParams() as Params;
  const { survey, event } = useFetchedSurvey('surveyWrapper', surveyId);
  const submissions = useFetchedSurveySubmissions(
    'surveySubmissions',
    surveyId,
  );
  const fetchingSurveys = useAppSelector((state) => state.surveys.fetching);
  const fetchingSubmissions = useAppSelector(
    (state) => state.surveySubmissions.fetching,
  );

  if (!survey) {
    return <LoadingPage loading={fetchingSurveys} />;
  }

  return (
    <Page
      cover={
        !survey.isTemplate && (
          <PageCover
            image={event?.cover}
            imagePlaceholder={event?.coverPlaceholder}
          />
        )
      }
      title={survey.title}
      back={{ href: `/surveys/${survey.isTemplate ? 'templates' : ''}` }}
      tabs={!survey.isTemplate && <SurveyDetailTabs surveyId={survey.id} />}
    >
      <Helmet title={survey.title} />
      <Outlet
        context={
          {
            survey,
            event,
            submissions,
            fetchingSubmissions,
          } as SurveysRouteContext
        }
      />
    </Page>
  );
};

export default SurveysWrapper;
