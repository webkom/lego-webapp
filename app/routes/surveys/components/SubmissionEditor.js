// @flow

import styles from './surveys.css';
import React from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextArea, RadioButton, CheckBox } from 'app/components/Form';
import { createValidator, required } from 'app/utils/validation';
import { reduxForm, FieldArray } from 'redux-form';
import type { SurveyEntity } from 'app/reducers/surveys';
import { Content, ContentHeader } from 'app/components/Content';
import { Link } from 'react-router';

type Props = {
  survey: SurveyEntity,
  submitting: boolean,
  handleSubmit: ((Object) => Promise<*>) => void,
  autoFocus: any,
  fetching: boolean,
  submitFunction: (Object, ?number) => Promise<*>
};

type ArrayFieldProps = {
  fields: Array<any>,
  meta: any
};

const SubmissionEditor = ({
  survey,
  fetching,
  submitting,
  handleSubmit,
  submitFunction
}: Props) => {
  const onSubmit = (formContent: Object) => {
    return submitFunction({
      ...formContent,
      logo: formContent.logo || undefined,
      studentContact:
        formContent.studentContact && Number(formContent.studentContact.id),
      surveyId: survey && survey.id
    });
  };

  const renderQuestions = ({ fields, meta }: ArrayFieldProps) => (
    <ul className={styles.detailQuestions}>
      {(survey.questions || []).map(question => (
        <li key={question.id}>
          <h3 className={styles.questionTextDetail}>
            {question.questionText}
            {question.mandatory && <span className={styles.mandatory}> *</span>}
          </h3>

          {question.questionType === 3 ? (
            <TextArea
              name={question.id}
              placeholder="Skriv her..."
              className={styles.freeText}
            />
          ) : (
            <ul className={styles.detailOptions}>
              {(question.options || []).map(option => (
                <li key={option.id}>
                  {question.questionType === 1 ? (
                    <Field
                      name={question.id}
                      component={RadioButton.Field}
                      className={styles.option}
                      normalize={v => !!v}
                    />
                  ) : (
                    <Field
                      name={question.id}
                      component={CheckBox.Field}
                      className={styles.option}
                      normalize={v => !!v}
                    />
                  )}
                  {option.optionText}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
  if (fetching) {
    return <LoadingIndicator />;
  }

  return (
    <Content className={styles.surveyDetail} banner={survey.event.cover}>
      <ContentHeader>{survey.title}</ContentHeader>

      <div className={styles.surveyTime}>
        Spørreundersøkelse for{' '}
        <Link to={`/surveys/${survey.event}`}>{survey.event.title}</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldArray name="answers" component={renderQuestions} />

        <div className={styles.clear} />
        <Button className={styles.submit} disabled={submitting} submit>
          Lagre
        </Button>
      </form>
    </Content>
  );
};

const validate = createValidator({
  title: [required()],
  event: [required()]
});

export default reduxForm({
  form: 'submissionEditor',
  validate,
  enableReinitialize: true
})(SubmissionEditor);
