// @flow

import styles from './surveys.css';
import React from 'react';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextArea, RadioButton, CheckBox, legoForm } from 'app/components/Form';
import { createValidator, required } from 'app/utils/validation';
import type { SurveyEntity } from 'app/reducers/surveys';
import { Content, ContentHeader } from 'app/components/Content';
import { Link } from 'react-router';
import { QuestionTypes } from '../utils';

type Props = {
  survey: SurveyEntity,
  submitting: boolean,
  handleSubmit: ((Object) => Promise<*>) => void,
  autoFocus: any,
  fetching: boolean,
  submitFunction: (Object, ?number) => Promise<*>
};

const SubmissionEditor = ({
  survey,
  fetching,
  submitting,
  handleSubmit,
  submitFunction
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

const validate = createValidator({
  user: [required()]
});

const prepareToSubmit = (formContent: Object, props: Props) => {
  const { survey, submitFunction } = props;
  const toSubmit = {
    ...formContent,
    user: formContent.user && formContent.user.id,
    surveyId: survey.id,

    answers: formContent.answers
      .map((answer, i) => {
        const question = survey.questions[i];
        const selected = answer.selectedOptions || [];
        const selectedOptions =
          question.questionType === QuestionTypes('single')
            ? selected.map(Number)
            : selected
                .map(
                  (optionSelected, j) =>
                    optionSelected && question.options[j].id
                )
                .filter(option => option);

        return {
          ...answer,
          question: question.id,
          selectedOptions,
          answerText: answer.answerText || ''
        };
      })
      .filter(answer => answer)
  };

  return submitFunction(toSubmit);
};

export default legoForm({
  form: 'submissionEditor',
  validate,
  onSubmit: (data, dispatch, props) => prepareToSubmit(data, props)
})(SubmissionEditor);
