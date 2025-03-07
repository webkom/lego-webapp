import { LinkButton, LoadingIndicator, LoadingPage } from '@webkom/lego-bricks';
import { useContext } from 'react';
import { navigate } from 'vike/client/router';
import { ContentSection, ContentMain } from '~/components/Content';
import Time from '~/components/Time';
import { SurveysRouteContext } from '~/pages/(migrated)/surveys/@surveyId/(wrapper)/SurveysRouteContext';
import { useAppSelector } from '~/redux/hooks';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import AdminSideBar from '../../components/AdminSideBar';
import StaticSubmission from '../../components/StaticSubmission';
import styles from '../../components/surveys.module.css';

type SurveyDetailPageParams = {
  surveyId: string;
};
const SurveyDetailPage = () => {
  const { surveyId } = useParams<SurveyDetailPageParams>();
  const { survey, event } = useContext(SurveysRouteContext);
  const fetching = useAppSelector((state) => state.surveys.fetching);
  const actionGrant = survey?.actionGrant;

  if (!survey || !actionGrant) {
    return <LoadingIndicator loading={fetching} />;
  }

  if (!actionGrant?.includes('edit')) {
    navigate(`/surveys/${surveyId}/answer`);
  }

  return (
    <ContentSection>
      <ContentMain>
        {survey.isTemplate ? (
          <h2
            style={{
              color: 'var(--lego-red-color)',
            }}
          >
            Dette er malen {survey.title}
          </h2>
        ) : (
          <>
            <div className={styles.surveyTime}>
              Spørreundersøkelse for{' '}
              <a href={`/events/${event.id}`}>{event.title}</a>
            </div>

            <div className={styles.surveyTime}>
              Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
            </div>

            <LinkButton href={`/surveys/${survey.id}/answer`}>
              Svar på undersøkelsen
            </LinkButton>
          </>
        )}
        <StaticSubmission survey={survey} />
      </ContentMain>

      <AdminSideBar
        surveyId={survey.id}
        actionGrant={actionGrant}
        token={survey.token}
        isTemplate={survey.isTemplate}
      />
    </ContentSection>
  );
};

export default guardLogin(SurveyDetailPage);
