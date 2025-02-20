import { Card, LoadingIndicator, Page, PageCover } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';
import { ContentMain, ContentSection } from 'app/components/Content';
import Time from 'app/components/Time';
import AlreadyAnswered from 'app/routes/surveys/components/AddSubmission/AlreadyAnswered';
import SurveySubmissionForm from 'app/routes/surveys/components/AddSubmission/SurveySubmissionForm';
import styles from 'app/routes/surveys/components/surveys.module.css';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import {
  addSubmission,
  fetchUserSubmission,
} from '~/redux/actions/SurveySubmissionActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectOwnSurveySubmission } from '~/redux/slices/surveySubmissions';
import { useFetchedSurvey } from '~/redux/slices/surveys';
import type { FormSurveySubmission } from '~/redux/models/SurveySubmission';

type AddSubmissionPageParams = {
  surveyId: string;
};
const AddSubmissionPage = () => {
  const dispatch = useAppDispatch();
  const { surveyId } =
    useParams<AddSubmissionPageParams>() as AddSubmissionPageParams;
  const currentUser = useCurrentUser();
  const { survey, event } = useFetchedSurvey('addSubmission', surveyId);
  const submission = useAppSelector((state) =>
    selectOwnSurveySubmission(state, {
      surveyId: Number(surveyId),
    }),
  );

  const fetchingSubmission = useAppSelector(
    (state) => state.surveySubmissions.fetching,
  );

  usePreparedEffect(
    'fetchAddSubmissionSurveySubmission',
    () =>
      currentUser?.id &&
      dispatch(fetchUserSubmission(Number(surveyId), Number(currentUser.id))),
    [surveyId, currentUser?.id],
  );

  if (!survey || !event || !currentUser) {
    return <LoadingIndicator loading={fetchingSubmission} />;
  }

  if (survey.templateType) {
    return (
      <Page
        title={survey.title}
        back={{ href: '/', label: 'Tilbake til forsiden' }}
      >
        <Card severity="danger">
          Denne undersøkelsen er en mal, og kan derfor ikke besvares.
        </Card>
      </Page>
    );
  }

  if (submission) {
    return <AlreadyAnswered survey={survey} submission={submission} />;
  }

  if (
    moment(survey.activeFrom) > moment() &&
    !survey.actionGrant.includes('edit')
  ) {
    return (
      <Page
        title={survey.title}
        back={{ href: '/', label: 'Tilbake til forsiden' }}
      >
        <ContentMain>
          <Card severity="warning">
            Denne undersøkelsen er ikke aktiv enda. Den vil aktiveres{' '}
            <Time time={survey.activeFrom} format="HH:mm DD. MMM" />.
          </Card>
        </ContentMain>
      </Page>
    );
  }

  const initialValues: FormSurveySubmission = {
    user: currentUser.id,
    answers: survey.questions.map((question) => ({
      question: question.id,
      selectedOptions: [],
      answerText: '',
    })),
  };

  return (
    <Page
      cover={
        <PageCover
          image={event.cover}
          imagePlaceholder={event.coverPlaceholder}
        />
      }
      title={survey.title}
    >
      <Helmet title={`Besvarer: ${survey.title}`} />

      <ContentSection>
        <ContentMain>
          <div className={styles.surveyTime}>
            Spørreundersøkelse for arrangementet{' '}
            <Link to={`/events/${event.id}`}>{event.title}</Link>
          </div>

          <div className={styles.surveyTime}>
            Alle svar på spørreundersøkelser er anonyme
          </div>

          <SurveySubmissionForm
            survey={survey}
            initialValues={initialValues}
            onSubmit={(values) =>
              dispatch(addSubmission({ surveyId, ...values }))
            }
          />
        </ContentMain>
      </ContentSection>
    </Page>
  );
};

export default guardLogin(AddSubmissionPage);
