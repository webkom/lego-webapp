import { LinkButton, LoadingPage } from '@webkom/lego-bricks';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router';
import { ContentSection, ContentMain } from 'app/components/Content';
import Time from 'app/components/Time';
import { displayNameForEventType } from 'app/routes/events/utils';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { useAppSelector } from '~/redux/hooks';
import AdminSideBar from './AdminSideBar';
import StaticSubmission from './StaticSubmission';
import styles from './surveys.module.css';
import type { SurveysRouteContext } from 'app/routes/surveys';

type SurveyDetailPageParams = {
  surveyId: string;
};
const SurveyDetailPage = () => {
  const { surveyId } =
    useParams<SurveyDetailPageParams>() as SurveyDetailPageParams;
  const { survey, event } = useOutletContext<SurveysRouteContext>();

  const fetching = useAppSelector((state) => state.surveys.fetching);
  const actionGrant = survey?.actionGrant;

  const navigate = useNavigate();

  if (!event || !actionGrant) {
    return <LoadingPage loading={fetching} />;
  }

  if (!actionGrant?.includes('edit')) {
    navigate(`/surveys/${surveyId}/answer`);
  }

  return (
    <ContentSection>
      <ContentMain>
        {survey.templateType ? (
          <h2
            style={{
              color: 'var(--lego-red-color)',
            }}
          >
            Dette er malen for arrangementer av type{' '}
            {displayNameForEventType(survey.templateType)}
          </h2>
        ) : (
          <>
            <div className={styles.surveyTime}>
              Spørreundersøkelse for{' '}
              <Link to={`/events/${event.id}`}>{event.title}</Link>
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
      />
    </ContentSection>
  );
};

export default guardLogin(SurveyDetailPage);
