import { LoadingPage, Page, PageCover } from '@webkom/lego-bricks';
import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppSelector } from '~/redux/hooks';
import { useFetchedSurveySubmissions } from '~/redux/slices/surveySubmissions';
import { useFetchedSurvey } from '~/redux/slices/surveys';
import { useParams } from '~/utils/useParams';
import { SurveyDetailTabs } from '../../utils';
import { SurveysRouteContext } from './SurveysRouteContext';

type Params = {
  surveyId: string;
};

const SurveysWrapper = ({ children }: PropsWithChildren) => {
  const { surveyId } = useParams<Params>();
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
      <SurveysRouteContext.Provider
        value={{
          survey,
          event,
          submissions,
          fetchingSubmissions,
        }}
      >
        {children}
      </SurveysRouteContext.Provider>
    </Page>
  );
};

export default SurveysWrapper;
