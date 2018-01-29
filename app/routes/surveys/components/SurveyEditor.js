// @flow

import styles from './surveys.css';
import React, { Component } from 'react';
import { DetailNavigation, ListNavigation } from '../utils.js';
import Question from './Question';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import {
  TextInput,
  CheckBox,
  SelectInput,
  DatePicker
} from 'app/components/Form';
import { createValidator, required } from 'app/utils/validation';
import { reduxForm } from 'redux-form';
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

type State = {
  questions: Array<Object>
};

class SurveyEditor extends Component<Props, State> {
  state = {
    questions: []
  };

  componentDidMount() {
    const questions =
      this.props.survey.questions.length === 0
        ? [
            {
              questionText: '',
              questionType: 1,
              options: []
            }
          ]
        : this.props.survey.questions;
    this.setState({ questions });
  }

  onSubmit = (formContent: Object) => {
    const { survey, submitFunction, push } = this.props;
    const { questions } = this.state;

    // Remove options if it's a free text question, and remove all empty
    // options
    const cleanQuestions = questions.map((q, i) => {
      const question = {
        ...q,
        relativeIndex: i
      };

      if (question.questionType === 3) {
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

  updateQuestion = (question: Object, index: number) => {
    const questions = this.state.questions.slice();
    if (index !== -1) {
      questions[index] = question;
    } else {
      questions.push(question);
    }
    this.setState({ questions });
  };

  deleteQuestion = (index: number) => {
    this.setState(state => ({
      questions: state.questions.filter((question, i) => i !== index)
    }));
    return Promise.resolve();
  };

  render() {
    const {
      survey,
      submitting,
      autoFocus,
      handleSubmit,
      deleteSurvey
    } = this.props;

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
        <form onSubmit={handleSubmit(this.onSubmit)}>
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

          <ul className={styles.questions}>
            {this.state.questions.map((question, i) => (
              <Question
                key={i}
                index={i}
                question={question}
                updateQuestion={this.updateQuestion}
                deleteQuestion={this.deleteQuestion}
              />
            ))}
          </ul>

          <Link
            onClick={() => {
              const newQuestion = {
                questionText: '',
                questionType: 1,
                mandatory: false,
                options: []
              };
              const questions = [...this.state.questions, newQuestion];
              this.setState({ questions });
            }}
          >
            <Icon name="add-circle" size={30} className={styles.addQuestion} />
          </Link>

          <div className={styles.clear} />
          <Button className={styles.submit} disabled={submitting} submit>
            Lagre
          </Button>
        </form>
      </Content>
    );
  }
}

const validate = createValidator({
  title: [required()],
  event: [required()]
});

export default reduxForm({
  form: 'surveyEditor',
  validate,
  enableReinitialize: true
})(SurveyEditor);
