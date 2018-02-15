// @flow

import styles from '../surveys.css';
import React from 'react';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextArea, RadioButton, CheckBox, legoForm } from 'app/components/Form';
import type { SurveyEntity } from 'app/reducers/surveys';
import { Content, ContentHeader } from 'app/components/Content';
import { Link } from 'react-router';
import { QuestionTypes } from '../../utils';
import { SubmissionError } from 'redux-form';

type Props = {
  survey: SurveyEntity,
  submitting: boolean,
  handleSubmit: ((Object) => Promise<*>) => void,
  autoFocus: any,
  fetching: boolean,
  submitFunction: (Object, ?number) => Promise<*>,
  push: string => void,
  error: Object
};

const SubmissionEditor = ({
  survey,
  fetching,
  submitting,
  handleSubmit,
  submitFunction,
  error
}: Props) => {
  return (
    <Content className={styles.surveyDetail} banner={survey.event.cover}>
      <ContentHeader>{survey.title}</ContentHeader>

      <div className={styles.surveyTime}>
        Spørreundersøkelse for arrangementet{' '}
        <Link to={`/surveys/${survey.event.id}`}>{survey.event.title}</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <ul className={styles.detailQuestions}>
          {(survey.questions || []).map((question, i) => (
            <li key={question.id}>
              <h3 className={styles.questionTextDetail}>
                {question.questionText}
                {question.mandatory && (
                  <span className={styles.mandatory}> *</span>
                )}
                {error && error.questions && error.questions[question.id] ? (
                  <span style={{ color: 'red', marginLeft: '20px' }}>
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
                    <li key={option.id}>
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

        <div className={styles.clear} />
        <Button className={styles.submit} disabled={submitting} submit>
          Lagre
        </Button>
      </form>
    </Content>
  );
};

const prepareToSubmit = (formContent: Object, props: Props) => {
  validateMandatory(formContent, props);
  const { survey, submitFunction, push } = props;

  const toSubmit = {
    ...formContent,
    user: formContent.user && formContent.user.id,
    surveyId: survey.id,
    answers: formatAnswers(formContent.answers, survey).filter(answer => answer)
  };

  return submitFunction(toSubmit).then(
    e => e.success && push(`/surveys/${survey.id}`)
  );
};

const formatAnswers = (answers, survey) => {
  return answers.map((answer, i) => {
    const question = survey.questions[i];
    const selected = answer.selectedOptions || [];
    const selectedOptions =
      question.questionType === QuestionTypes('single')
        ? selected.map(Number).filter(Boolean)
        : selected
            .map(
              (optionSelected, j) => optionSelected && question.options[j].id
            )
            .filter(Boolean);

    return {
      ...answer,
      question: question.id,
      selectedOptions,
      answerText: answer.answerText || ''
    };
  });
};

const validateMandatory = (formContent: Object, props) => {
  const errors = { questions: {} };
  const answers = formatAnswers(formContent.answers, props.survey);

  const answeredQuestionIds = answers
    ? answers
        .filter(
          answer =>
            answer.selectedOptions.length > 0 || answer.answerText !== ''
        )
        .map(answer => answer.question)
    : [];

  props.survey.questions.map(question => {
    if (question.mandatory && !answeredQuestionIds.includes(question.id)) {
      errors.questions[question.id] = 'Dette feltet er obligatorisk';
    }
  });

  if (Object.keys(errors.questions).length > 0) {
    throw new SubmissionError({
      _error: errors
    });
  }
};

export default legoForm({
  form: 'submissionEditor',
  onSubmit: (data, dispatch, props) => prepareToSubmit(data, props)
})(SubmissionEditor);
