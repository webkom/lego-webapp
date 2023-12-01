import { Button, LoadingIndicator } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Content, ContentSection, ContentMain } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import Time from 'app/components/Time';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { useFetchedSurvey } from 'app/reducers/surveys';
import { eventTypeToString } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import { DetailNavigation } from '../utils';
import AdminSideBar from './AdminSideBar';
import StaticSubmission from './StaticSubmission';
import styles from './surveys.css';

const SurveyDetailPage = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const survey = useFetchedSurvey('surveyDetail', surveyId);
  const fetching = useAppSelector((state) => state.surveys.fetching);
  const actionGrant = survey?.actionGrant;
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  if (fetching || !actionGrant) {
    return <LoadingIndicator loading />;
  }

  if (!actionGrant?.includes('edit')) {
    return <Redirect to={`/surveys/${surveyId}/answer`} />;
  }

  return (
    <Content banner={survey.templateType ? undefined : survey.event.cover}>
      <Helmet title={survey.title} />
      <DetailNavigation title={survey.title} surveyId={Number(survey.id)} />

      <ContentSection>
        <ContentMain>
          {survey.templateType ? (
            <h2
              style={{
                color: 'var(--lego-red-color)',
              }}
            >
              Dette er malen for arrangementer av type{' '}
              {eventTypeToString(survey.templateType)}
            </h2>
          ) : (
            <div>
              <div className={styles.surveyTime}>
                Spørreundersøkelse for{' '}
                <Link to={`/events/${survey.event.id}`}>
                  {survey.event.title}
                </Link>
              </div>

              <div className={styles.surveyTime}>
                Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
              </div>

              <Link to={`/surveys/${survey.id}/answer`}>
                <Button
                  style={{
                    marginTop: '30px',
                  }}
                >
                  Svar på undersøkelsen
                </Button>
              </Link>
            </div>
          )}
          <StaticSubmission survey={survey} />
        </ContentMain>

        <AdminSideBar
          surveyId={survey.id}
          actionGrant={actionGrant}
          token={survey.token}
        />
      </ContentSection>
    </Content>
  );
};

export default SurveyDetailPage;
