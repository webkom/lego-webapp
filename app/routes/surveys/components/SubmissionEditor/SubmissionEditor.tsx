import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Field, SubmissionError } from 'redux-form';
import Button from 'app/components/Button';
import { Content, ContentHeader } from 'app/components/Content';
import { TextArea, RadioButton, CheckBox, legoForm } from 'app/components/Form';
import type { SurveyEntity } from 'app/reducers/surveys';
import type { UserEntity } from 'app/reducers/users';
import { QuestionTypes } from '../../utils';
import styles from '../surveys.css';

type Props = {
  survey: SurveyEntity;
  submitting: boolean;
  handleSubmit: (arg0: (arg0: Record<string, any>) => Promise<any>) => void;
  autoFocus: any;
  fetching: boolean;
  submitFunction: (
    arg0: Record<string, any>,
    arg1: number | null | undefined
  ) => Promise<any>;
  error: Record<string, any>;
  currentUser: UserEntity;
};

const SubmissionEditor = ({
  survey,
  submitting,
  handleSubmit,
  error,
}: Props) => {
  return (
    <Content className={styles.surveyDetail} banner={survey.event.cover}>
      <Helmet title={survey.title} />
      <ContentHeader>{survey.title}</ContentHeader>

      <div className={styles.surveyTime}>
        Spørreundersøkelse for arrangementet{' '}
        <Link to={`/events/${survey.event.id}`}>{survey.event.title}</Link>
      </div>
      <div className={styles.surveyTime}>
        Alle svar på spørreundersøkelser er anonyme.
      </div>

      <form onSubmit={handleSubmit}>
        <ul className={styles.detailQuestions}>
          {(survey.questions || []).map((question, i) => (
            <li key={question.id} name={`question[${question.id}]`}>
              <h3 className={styles.questionTextDetail}>
                {question.questionText}
                {question.mandatory && (
                  <span className={styles.mandatory}> *</span>
                )}
                {error && error.questions && error.questions[question.id] ? (
                  <span
                    style={{
                      color: 'var(--danger-color)',
                      marginLeft: '20px',
                    }}
                  >
                    {error.questions[question.id]}
                  </span>
                ) : (
                  ''
                )}
              </h3>

              {question.questionType === QuestionTypes('text') ? (
                <Field
                  component={TextArea.Field}
                  placeholder="Skriv her..."
                  name={`answers[${i}].answerText`}
                  className={styles.freeText}
                />
              ) : (
                <ul className={styles.detailOptions}>
                  {(question.options || []).map((option, j) => (
                    <li key={option.id} className={styles.submissionOptions}>
                      {question.questionType === QuestionTypes('single') ? (
                        <Field
                          component={RadioButton.Field}
                          label={option.optionText}
                          name={`answers[${i}].selectedOptions[${i}]`}
                          inputValue={String(option.id)}
                          className={styles.formOption}
                        />
                      ) : (
                        <Field
                          component={CheckBox.Field}
                          label={option.optionText}
                          name={`answers[${i}].selectedOptions[${j}]`}
                          className={styles.formOption}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <Button success disabled={submitting} submit>
          Send svar
        </Button>
      </form>
    </Content>
  );
};

const prepareToSubmit = (formContent: Record<string, any>, props: Props) => {
  const safeAnswers = new Array(formContent.answers.length);
  formContent.answers.forEach((elem, i) => {
    if (elem) safeAnswers[i] = elem;
  });
  validateMandatory(safeAnswers, props);
  const { survey, submitFunction, currentUser } = props;
  const toSubmit = {
    ...formContent,
    user: currentUser && currentUser.id,
    surveyId: survey.id,
    answers: formatAnswers(safeAnswers, survey).filter(Boolean),
  };
  return submitFunction(toSubmit);
};

const formatAnswers = (answers, survey) => {
  return answers.map((answer, i) => {
    const question = survey.questions[i];
    const selected = answer.selectedOptions || [];
    const selectedOptions = (
      question.questionType === QuestionTypes('single')
        ? selected.map(Number)
        : selected.map(
            (optionSelected, j) => optionSelected && question.options[j].id
          )
    ).filter(Boolean);
    return {
      ...answer,
      question: question.id,
      selectedOptions,
      answerText: answer.answerText || '',
    };
  });
};

const validateMandatory = (inputAnswers: Array<Record<string, any>>, props) => {
  const errors = {
    questions: {},
  };
  const answers = formatAnswers(inputAnswers, props.survey);
  const answeredQuestionIds = answers
    ? answers
        .filter(
          (answer) =>
            answer.selectedOptions.length > 0 || answer.answerText !== ''
        )
        .map((answer) => answer.question)
    : [];
  props.survey.questions.forEach((question) => {
    if (question.mandatory && !answeredQuestionIds.includes(question.id)) {
      errors.questions[question.id] = 'Dette feltet er obligatorisk';
    }
  });

  if (Object.keys(errors.questions).length > 0) {
    throw new SubmissionError({
      _error: errors,
    });
  }
};

export default legoForm({
  form: 'submissionEditor',
  onSubmit: (data, dispatch, props) => prepareToSubmit(data, props),
})(SubmissionEditor);
