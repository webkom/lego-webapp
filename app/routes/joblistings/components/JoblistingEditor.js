// @flow

import React from 'react';
import styles from './JoblistingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field, change } from 'redux-form';
import {
  TextInput,
  EditorField,
  Form,
  SelectInput,
  DatePicker
} from 'app/components/Form';
import Button from 'app/components/Button';
import moment from 'moment-timezone';
import config from 'app/config';
import { Content } from 'app/components/Layout';
import { Flex } from 'app/components/Layout';
import { places, jobTypes, yearValues } from '../constants';

import type { Joblisting, Workplace, ID } from 'app/models';

type Props = {
  joblistingId?: string,
  joblisting: Joblisting,
  handleSubmit: Function => void,
  submitJoblisting: Workplace => void,
  deleteJoblisting: ID => void,
  company?: Object,
  dispatch: any => void,
  isNew: boolean,
  fetching: boolean
};

function JoblistingEditor({
  handleSubmit,
  joblistingId,
  joblisting,
  isNew,
  submitJoblisting,
  deleteJoblisting,
  company,
  dispatch,
  fetching = false
}: Props) {
  const onSubmit = newJoblisting => {
    const workplaces = newJoblisting.workplaces
      ? newJoblisting.workplaces.map(obj => ({ town: obj.value }))
      : null;

    submitJoblisting({
      ...newJoblisting,
      workplaces
    });
  };

  if (!isNew && fetching) {
    return <LoadingIndicator loading />;
  }

  return (
    <Content>
      <h1 className={styles.heading}>
        {!isNew ? 'Rediger jobbannonse' : 'Legg til jobbannonse'}
      </h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Field
          placeholder="Tittel på jobbannonse"
          label="Tittel"
          name="title"
          component={TextInput.Field}
          required
        />
        <Field
          placeholder="Bedriften annonsen gjelder"
          label="Bedrift"
          name="company"
          component={SelectInput.AutocompleteField}
          filter={['companies.company']}
          onChange={() =>
            dispatch(
              change('joblistingEditor', 'responsible', {
                label: 'Ingen',
                value: null
              })
            )}
        />
        <Field
          name="jobType"
          label="Jobbtype"
          component={SelectInput.Field}
          placeholder="Type stilling"
          simpleValue
          options={jobTypes}
        />
        <Field
          placeholder="Søknadsfrist"
          dateFormat="ll"
          label="Søknadsfrist"
          showTimePicker={true}
          name="deadline"
          id="gallery-takenAt"
          component={DatePicker.Field}
        />
        <Field
          name="visibleFrom"
          label="Synlig fra dato"
          component={DatePicker.Field}
        />
        <Field
          name="visibleTo"
          label="Synlig til dato"
          component={DatePicker.Field}
        />
        <Field
          placeholder="Arbeidssteder"
          label="Arbeidssteder"
          name="workplaces"
          component={SelectInput.Field}
          options={places}
          tags
        />
        <Field
          name="fromYear"
          label="For klasse trinn fra"
          placeholder="Jobbtype"
          simpleValue
          component={SelectInput.Field}
          options={yearValues}
        />
        <Field
          name="toYear"
          label="Til klasse"
          placeholder="Jobbtype"
          simpleValue
          component={SelectInput.Field}
          options={yearValues}
        />
        <Field
          placeholder="Lenke til søknad"
          label="Søknadslenke"
          name="applicationUrl"
          component={TextInput.Field}
        />
        <Field
          placeholder="Kontaktperson"
          label="Kontaktperson"
          name="responsible"
          component={SelectInput.AutocompleteField}
          filter={['companies.companycontact']}
        />
        <Field
          name="description"
          className={styles.descriptionField}
          label="Søknadsintro"
          placeholder="Intro til søknaden"
          component={EditorField.Field}
        />
        <Field
          name="text"
          className={styles.textField}
          label="Søknadstekst:"
          placeholder="Hoveddel av søknaden"
          component={EditorField.Field}
        />

        <Flex
          className={styles.buttonRow}
          alignItems="baseline"
          justifyContent="flex-end"
        >
          {!isNew && (
            <Button dark onClick={() => deleteJoblisting(joblisting.id)}>
              Delete
            </Button>
          )}
          <Button className={styles.submit} submit>
            Lagre
          </Button>
        </Flex>
      </Form>
    </Content>
  );
}

export default reduxForm({
  form: 'joblistingEditor',
  enableReinitialize: true,
  validate(values) {
    const errors = {};
    if (!values.title) {
      errors.title = 'Du må gi jobbannonsen en tittel';
    }
    if (!values.description) {
      errors.description = 'Du må skrive en søknadsintro';
    }
    if (!values.company || values.company.value == null) {
      errors.company = 'Du må angi en bedrift for jobbannonsen';
    }
    if (parseInt(values.fromYear, 10) > parseInt(values.toYear, 10)) {
      errors.toYear = "'Til år' kan ikke være lavere enn 'Fra år'";
    }
    if (!values.workplaces) {
      errors.workplaces = 'Arbeidssteder kan ikke være tom';
    }

    // TODO: and unify timezone handling
    // $FlowFixMe
    const visibleFrom = moment.tz(values.visibleFrom, config.timezone);

    // $FlowFixMe
    const visibleTo = moment.tz(values.visibleTo, config.timezone);
    if (visibleFrom > visibleTo) {
      errors.visibleTo = 'Sluttidspunkt kan ikke være før starttidspunkt';
    }
    return errors;
  }
})(JoblistingEditor);
