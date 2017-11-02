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
import Content from 'app/components/Layout/Content';

type Props = {
  survey: SurveyEntity,
  submitting: boolean,
  handleSubmit: ((SurveyEntity) => Promise<*>) => void,
  autoFocus: any,
  fetching: boolean,
  submitFunction: (SurveyEntity, ?number) => Promise<*>,
  deleteSurvey: number => Promise<*>,
  push: string => void
};

class SurveyEditor extends Component<Props> {
  onSubmit = (formContent: Object) => {
    const { survey, submitFunction, push } = this.props;
    return submitFunction({
      ...formContent,
      logo: formContent.logo || undefined,
      studentContact:
        formContent.studentContact && Number(formContent.studentContact.id),
      surveyId: survey && survey.id
    }).then(result => push(`/surveys/${result.id}`));
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
      <Content>
        <div className={styles.detail}>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            {survey ? (
              <DetailNavigation
                title={titleField}
                surveyId={Number(survey.id)}
                deleteFunction={deleteSurvey}
              />
            ) : (
              <ListNavigation title={titleField} />
            )}

            <Field
              placeholder="Bekk Miniseminar"
              label="Arrangement"
              autoFocus={autoFocus}
              name="event"
              component={SelectInput.AutocompleteField}
              className={styles.editEvent}
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
