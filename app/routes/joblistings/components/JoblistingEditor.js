// @flow

import React from 'react';
import styles from './JoblistingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field, change } from 'redux-form';
import { Form, SelectInput } from 'app/components/Form';
import Button from 'app/components/Button';
import moment from 'moment';
import config from 'app/config';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import {
  DatePickerComponent,
  YearPickerComponent,
  FieldComponent,
  TextEditorComponent
} from './JoblistingEditorItems';
import { places, jobTypes } from '../constants';

type Props = {
  joblistingId?: string,
  joblisting?: Object,
  handleSubmit: () => void,
  submitJoblisting: () => void,
  company?: Object,
  dispatch: () => void,
  isNew: boolean,
  fetching: boolean
};

function JoblistingEditor({
  handleSubmit,
  joblistingId,
  joblisting,
  isNew,
  submitJoblisting,
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
    <div className={styles.root}>
      <h1 className={styles.heading}>
        {!isNew ? 'Rediger jobbannonse' : 'Legg til jobbannonse'}
      </h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FieldComponent text="Tittel: " name="title" placeholder="Tittel" />
        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Bedrift: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder="Bedrift"
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
          </FlexColumn>
        </FlexRow>

        <DatePickerComponent text="Deadline:" name="deadline" />
        <DatePickerComponent text="Synlig fra:" name="visibleFrom" />
        <DatePickerComponent text="Synlig til:" name="visibleTo" />

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Jobbtype: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              name="jobType"
              component={SelectInput.Field}
              placeholder="Jobbtype"
              simpleValue
              options={jobTypes}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Arbeidssteder: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder="Arbeidssteder"
              name="workplaces"
              component={SelectInput.Field}
              options={places}
              tags
            />
          </FlexColumn>
        </FlexRow>

        <YearPickerComponent text="Fra år: " name="fromYear" />
        <YearPickerComponent text="Til år: " name="toYear" />

        <FieldComponent
          text="Søknadslenke: "
          name="applicationUrl"
          placeholder="Søknadslenke"
        />

        <TextEditorComponent
          text="Søknadsintro: "
          name="description"
          placeholder="Søknadsintro"
        />
        <TextEditorComponent
          text="Søknadstekst: "
          name="text"
          placeholder="Søknadstekst"
        />

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Kontaktperson: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder="Kontaktperson"
              name="responsible"
              component={SelectInput.AutocompleteField}
              filter={['companies.companycontact']}
            />
          </FlexColumn>
        </FlexRow>
        <Button className={styles.submit} submit>
          Lagre
        </Button>
      </Form>
    </div>
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
    if (!values.company || values.company.value == null) {
      errors.company = 'Du må angi en bedrift for jobbannonsen';
    }
    if (parseInt(values.fromYear, 10) > parseInt(values.toYear, 10)) {
      errors.toYear = "'Til år' kan ikke være lavere enn 'Fra år'";
    }
    if (!values.workplaces) {
      errors.workplaces = 'Arbeidssteder kan ikke være tom';
    }
    const visibleFrom = moment.tz(values.visibleFrom, config.timezone);
    const visibleTo = moment.tz(values.visibleTo, config.timezone);
    if (visibleFrom > visibleTo) {
      errors.visibleTo = 'Sluttidspunkt kan ikke være før starttidspunkt';
    }
    return errors;
  }
})(JoblistingEditor);
