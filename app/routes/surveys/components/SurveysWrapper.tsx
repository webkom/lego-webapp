import { LoadingPage, Page, PageCover } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Outlet, useParams } from 'react-router-dom';
import { useFetchedSurveySubmissions } from 'app/reducers/surveySubmissions';
import { useFetchedSurvey } from 'app/reducers/surveys';
import { useAppSelector } from 'app/store/hooks';
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
  const fetching = useAppSelector((state) => state.surveys.fetching);

  if (!survey) {
    return <LoadingPage loading={fetching} />;
  }

  const isTemplate = !!survey.templateType;

  return (
    <Page
      cover={
        !isTemplate && (
          <PageCover
            image={event?.cover}
            imagePlaceholder={event?.coverPlaceholder}
          />
        )
      }
      title={survey.title}
      back={{ href: `/surveys/${isTemplate ? 'templates' : ''}` }}
      tabs={!isTemplate && <SurveyDetailTabs surveyId={survey.id} />}
    >
      <Helmet title={survey.title} />
      <Outlet context={{ survey, event, submissions } as SurveysRouteContext} />
    </Page>
  );
};

export default SurveysWrapper;