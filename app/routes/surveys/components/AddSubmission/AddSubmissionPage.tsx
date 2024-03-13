import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  addSubmission,
  fetchUserSubmission,
} from 'app/actions/SurveySubmissionActions';
import { Content, ContentHeader } from 'app/components/Content';
import Time from 'app/components/Time';
import { selectSurveySubmissionForUser } from 'app/reducers/surveySubmissions';
import { useFetchedSurvey } from 'app/reducers/surveys';
import { useUserContext } from 'app/routes/app/AppRoute';
import AlreadyAnswered from 'app/routes/surveys/components/AddSubmission/AlreadyAnswered';
import SurveySubmissionForm from 'app/routes/surveys/components/AddSubmission/SurveySubmissionForm';
import styles from 'app/routes/surveys/components/surveys.css';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import type { FormSurveySubmission } from 'app/store/models/SurveySubmission';

const AddSubmissionPage = () => {
  const dispatch = useAppDispatch();
  const { surveyId } = useParams<{ surveyId: string }>();
  const { currentUser } = useUserContext();
  const survey = useFetchedSurvey('addSubmission', surveyId);
  const submission = useAppSelector((state) =>
    selectSurveySubmissionForUser(state, {
      surveyId: Number(surveyId),
      currentUserId: currentUser.id,
    })
  );

  const fetchingSubmission = useAppSelector(
    (state) => state.surveySubmissions.fetching
  );

  usePreparedEffect(
    'fetchAddSubmissionSurveySubmission',
    () =>
      currentUser.id &&
      dispatch(fetchUserSubmission(Number(surveyId), Number(currentUser.id))),
    [surveyId, currentUser.id]
  );

  if (!survey || !currentUser.id || fetchingSubmission) {
    return <LoadingIndicator loading />;
  }

  if (survey.templateType) {
    return (
      <Content className={styles.centerContent}>
        <h2>Denne undersøkelsen er en mal, og kan derfor ikke besvares.</h2>
        <Link to="/">Tilbake til forsiden</Link>
      </Content>
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
      <Content className={styles.centerContent}>
        <h2>Denne undersøkelsen er ikke aktiv enda.</h2>
        <p>
          Den vil aktiveres{' '}
          <Time time={survey.activeFrom} format="HH:mm DD. MMM" />.
        </p>
      </Content>
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
    <Content banner={survey.event.cover}>
      <Helmet title={`Besvarer: ${survey.title}`} />
      <ContentHeader>
        <h2>{survey.title}</h2>
      </ContentHeader>

      <div className={styles.surveyTime}>
        Spørreundersøkelse for arrangementet{' '}
        <Link to={`/events/${survey.event.id}`}>{survey.event.title}</Link>
      </div>
      <div className={styles.surveyTime}>
        Alle svar på spørreundersøkelser er anonyme.
      </div>

      <SurveySubmissionForm
        survey={survey}
        initialValues={initialValues}
        onSubmit={(values) => dispatch(addSubmission({ surveyId, ...values }))}
      />
    </Content>
  );
};

export default guardLogin(AddSubmissionPage);
