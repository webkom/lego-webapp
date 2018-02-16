// @flow

import styles from '../surveys.css';
import React from 'react';
import last from 'lodash/last';
import { DetailNavigation, ListNavigation, QuestionTypes } from '../../utils';
import Question from './Question';
import { Field, FieldArray, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import Button from 'app/components/Button';
import {
  TextInput,
  CheckBox,
  SelectInput,
  DatePicker,
  legoForm
} from 'app/components/Form';
import { createValidator, required } from 'app/utils/validation';
import type { SurveyEntity } from 'app/reducers/surveys';
import { Content } from 'app/components/Content';
import type { FieldProps } from 'redux-form';
import Icon from 'app/components/Icon';
import { Link } from 'react-router';

type Props = FieldProps & {
  survey: SurveyEntity,
  autoFocus: Object,
  submitFunction: (SurveyEntity, ?number) => Promise<*>,
  deleteSurvey: number => Promise<*>,
  push: string => void
};

const SurveyEditor = ({
  survey,
  submitting,
  autoFocus,
  handleSubmit,
  deleteSurvey,
  questions
}: Props) => {
  const titleField = (
    <Field
      placeholder="Tittel"
      label=" "
      autoFocus={autoFocus}
      name="title"
      component={TextInput.Field}
      className={styles.editTitle}
    />
  );

  return (
    <Content className={styles.detail}>
      <form onSubmit={handleSubmit}>
        {survey && survey.id ? (
          <DetailNavigation
            title={titleField}
            surveyId={Number(survey.id)}
            deleteFunction={deleteSurvey}
          />
        ) : (
          <ListNavigation title={titleField} />
        )}

        <div className={styles.checkBox}>
          <Field
            name="isClone"
            label="Klone av en annen undersøkelse?"
            component={CheckBox.Field}
            normalize={v => !!v}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Field
            placeholder="Bekk Miniseminar"
            label="Arrangement"
            autoFocus={autoFocus}
            name="event"
            component={SelectInput.AutocompleteField}
            className={styles.editEvent}
            filter={['events.event']}
          />

          <Field
            label="Aktiveringstidspunkt"
            name="activeFrom"
            component={DatePicker.Field}
          />
        </div>

        <FieldArray
          name="questions"
          questions={questions}
          component={renderQuestions}
        />

        <div className={styles.clear} />
        <Button className={styles.submit} disabled={submitting} submit>
          Lagre
        </Button>
      </form>
    </Content>
  );
};

const renderQuestions = ({ fields, meta: { touched, error }, questions }) => {
  return [
    <ul className={styles.questions} key="questions">
      {fields.map((question, i) => (
        <Question
          key={i}
          index={i}
          question={question}
          question_data={questions && questions[i]}
          deleteQuestion={() => Promise.resolve(fields.remove(i))}
        />
      ))}
    </ul>,

    <Link
      key="remove"
      onClick={() => {
        fields.push(initialQuestion);
      }}
    >
      <Icon name="add-circle" size={30} className={styles.addQuestion} />
    </Link>
  ];
};
export const initialQuestion = {
  questionText: '',
  questionType: QuestionTypes('single'),
  mandatory: false,
  options: [{ optionText: '' }]
};
const validate = createValidator({
  title: [required()],
  event: [required()]
});

const onSubmit = (formContent: Object, dispatch, props: Props) => {
  const { survey, submitFunction, push } = this.props;
  const { questions } = formContent;

  // Remove options if it's a free text question, and remove all empty
  // options
  const cleanQuestions = questions.map((q, i) => {
    const question = {
      ...q,
      relativeIndex: i
    };

    if (question.questionType === QuestionTypes('text')) {
      question.options = [];
    } else {
      question.options = question.options.filter(
        option => option.optionText !== ''
      );
    }
    return question;
  });

  return submitFunction({
    ...formContent,
    event: formContent.event && Number(formContent.event.value),
    surveyId: survey && survey.id,
    questions: cleanQuestions
  }).then(result => {
    const id = survey && survey.id ? survey.id : result.payload.result;
    push(`/surveys/${String(id)}`);
  });
};

const selector = formValueSelector('surveyEditor');
export default connect(state => {
  const questions = selector(state, 'questions');
  return {
    questions
  };
})(
  legoForm({
    form: 'surveyEditor',
    validate,
    onSubmit
  })(SurveyEditor)
);
