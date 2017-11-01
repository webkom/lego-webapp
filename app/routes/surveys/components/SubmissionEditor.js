// @flow

import styles from './surveys.css';
import React, { Component } from 'react';
import { DetailNavigation, ListNavigation } from '../utils.js';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import {
  TextInput,
  RadioButton,
  SelectInput,
  RadioButtonGroup
} from 'app/components/Form';
import { createValidator, required } from 'app/utils/validation';
import { reduxForm } from 'redux-form';
import type { SurveyEntity } from 'app/reducers/surveys';

type Props = {
  survey: SurveyEntity,
  submitting: boolean,
  handleSubmit: ((SurveyEntity) => Promise<*>) => void,
  autoFocus: any,
  fetching: boolean,
  submitFunction: (SurveyEntity, ?number) => Promise<*>,
  deleteSurvey: number => Promise<*>
};

class SubmissionEditor extends Component<Props> {
  onSubmit = (formContent: Object) => {
    const { survey, submitFunction } = this.props;
    return submitFunction({
      ...formContent,
      logo: formContent.logo || undefined,
      studentContact:
        formContent.studentContact && Number(formContent.studentContact.id),
      surveyId: survey && survey.id
    });
  };
  render() {
    const {
      survey,
      submitting,
      autoFocus,
      handleSubmit,
      fetching,
      deleteSurvey
    } = this.props;

    if (fetching) {
      return <LoadingIndicator />;
    }

    const nameField = (
      <Field
        placeholder="Tittel"
        label="Undersøkelse etter Bekk Miniseminar"
        autoFocus={autoFocus}
        name="title"
        component={TextInput.Field}
        className={styles.editTitle}
      />
    );

    return (
      <div className={styles.root}>
        <div className={styles.detail}>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            {survey ? (
              <DetailNavigation
                title={nameField}
                surveyId={Number(survey.id)}
                deleteFunction={deleteSurvey}
              />
            ) : (
              <ListNavigation title={nameField} />
            )}

            <Field
              placeholder="Arrangement"
              label=" "
              autoFocus={autoFocus}
              name="event"
              component={SelectInput.AutocompleteField}
              className={styles.editBubble}
              filter={['events.event']}
            />

            <div className={styles.info}>
              <div style={{ order: 0 }}>
                <RadioButtonGroup
                  name="is_clone"
                  label="Klone av en annen undersøkelse?"
                >
                  <Field
                    label="Ja"
                    component={RadioButton.Field}
                    inputValue="true"
                  />
                  <Field
                    label="Nei"
                    component={RadioButton.Field}
                    inputValue="false"
                  />
                </RadioButtonGroup>
              </div>
            </div>

            <div className={styles.clear} />
            <Button className={styles.submit} disabled={submitting} submit>
              Lagre
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

const validate = createValidator({
  title: [required()],
  event: [required()]
});

export default reduxForm({
  form: 'submissionEditor',
  validate,
  enableReinitialize: true
})(SubmissionEditor);
