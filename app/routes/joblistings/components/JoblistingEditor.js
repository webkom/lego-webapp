// @flow

import React from 'react';
import styles from './JoblistingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field } from 'redux-form';
import {
  Form,
  TextEditor,
  TextInput,
  DatePicker,
  SelectInput
} from 'app/components/Form';
import Button from 'app/components/Button';
import moment from 'moment';
import config from 'app/config';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';

type Props = {
  joblistingId?: string,
  joblisting?: Object,
  handleSubmit: () => void,
  onQueryChanged: () => void,
  searching: boolean,
  submitJoblisting: () => void,
  fetchCompany: () => void,
  company?: Object,
  results: Array,
  dispatch: () => void
};

function JoblistingEditor(
  {
    handleSubmit,
    results,
    joblistingId,
    joblisting,
    onQueryChanged,
    searching,
    submitJoblisting,
    company,
    fetchCompany,
    dispatch
  }: Props
) {
  const places = [
    { label: 'Oslo', value: 'Oslo' },
    { label: 'Bergen', value: 'Bergen' },
    { label: 'Stavanger', value: 'Stavanger' },
    { label: 'Trondheim', value: 'Trondheim' },
    { label: 'Drammen', value: 'Drammen' },
    { label: 'Fredrikstad', value: 'Fredrikstad' },
    { label: 'Sarpsborg', value: 'Sarpsborg' },
    { label: 'Kristiansand', value: 'Kristiansand' },
    { label: 'Ålesund', value: 'Ålesund' },
    { label: 'Tønsberg', value: 'Tønsberg' },
    { label: 'Moss', value: 'Moss' },
    { label: 'Haugesund', value: 'Haugesund' },
    { label: 'Sandefjord', value: 'Sandefjord' },
    { label: 'Arendal', value: 'Arendal' },
    { label: 'Bodø', value: 'Bodø' },
    { label: 'Tromsø', value: 'Tromsø' },
    { label: 'Hamar', value: 'Hamar' },
    { label: 'Larvik', value: 'Larvik' },
    { label: 'Kongsberg', value: 'Kongsberg' },
    { label: 'Molde', value: 'Molde' },
    { label: 'Lillehammer', value: 'Lillehammer' },
    { label: 'Drøbak', value: 'Drøbak' },
    { label: 'Hønefoss', value: 'Hønefoss' },
    { label: 'Elverum', value: 'Elverum' },
    { label: 'Kongsvinger', value: 'Kongsvinger' }
  ];

  const isEditPage = joblistingId !== undefined;
  if (isEditPage && !joblisting) {
    return <LoadingIndicator loading />;
  }
  const onSubmit = newJoblisting => {
    console.log('workplaces', newJoblisting.workplaces);
    const workplaces = newJoblisting.workplaces
      ? newJoblisting.workplaces.map(obj => ({ town: obj.value }))
      : null;
    const responsible = newJoblisting.responsible.id === -1
      ? null
      : newJoblisting.responsible.id;
    submitJoblisting({
      ...newJoblisting,
      workplaces,
      responsible
    });
  };

  const datePickerComponent = (text, name) => (
    <FlexRow className={styles.row}>
      <FlexColumn className={styles.des}>{text}</FlexColumn>
      <FlexColumn className={styles.textfield}>
        <Field name={name} component={DatePicker.Field} />
      </FlexColumn>
    </FlexRow>
  );

  const yearPickerComponent = (text, name) => (
    <FlexRow className={styles.row}>
      <FlexColumn className={styles.des}>{text}</FlexColumn>
      <FlexColumn className={styles.textfield}>
        <Field name={name} component="select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </Field>
      </FlexColumn>
    </FlexRow>
  );

  const fieldComponent = (text, name, placeholder) => (
    <FlexRow className={styles.row}>
      <FlexColumn className={styles.des}>{text}</FlexColumn>
      <FlexColumn className={styles.textfield}>
        <Field
          placeholder={placeholder}
          name={name}
          component={TextInput.Field}
        />
      </FlexColumn>
    </FlexRow>
  );

  const textEditorComponent = (text, name, placeholder, rows) => (
    <FlexRow className={styles.row}>
      <FlexColumn className={styles.des}>{text} </FlexColumn>
      <FlexColumn className={styles.textfield}>
        <Field
          placeholder={placeholder}
          name={name}
          rows={rows}
          component={TextEditor.Field}
        />
      </FlexColumn>
    </FlexRow>
  );

  console.log('asd', company);
  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>
        {isEditPage ? 'Rediger jobbannonse' : 'Legg til jobbannonse'}
      </h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {fieldComponent('Tittel: ', 'title', 'Tittel')}

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Bedrift: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Bedrift'}
              name="company"
              component={SelectInput.Field}
              options={results}
              fetching={searching}
              onSearch={query => onQueryChanged(query)}
              onChange={val => {
                fetchCompany(val[0]);
              }}
              simpleValue={false}
            />
          </FlexColumn>
        </FlexRow>

        {datePickerComponent('Deadline: ', 'deadline')}
        {datePickerComponent('Synlig fra: ', 'visibleFrom')}
        {datePickerComponent('Synlig til: ', 'visibleTo')}

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Jobbtype: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field name="jobType" component="select">
              <option value="summer_job">Sommerjobb</option>
              <option value="part_time">Deltid</option>
              <option value="full_time">Fulltid</option>
            </Field>
          </FlexColumn>
        </FlexRow>
        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Arbeidssteder: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Arbeidssteder'}
              name="workplaces"
              component={SelectInput.Field}
              options={places}
              tags
            />
          </FlexColumn>
        </FlexRow>

        {yearPickerComponent('Fra år: ', 'fromYear')}
        {yearPickerComponent('Til år: ', 'toYear')}
        {fieldComponent('Søknadslenke: ', 'applicationUrl', 'Søknadslenke')}
        {textEditorComponent(
          'Søknadsintro: ',
          'description',
          'Søknadsintro',
          '7'
        )}
        {textEditorComponent('Søknadstekst: ', 'text', 'Søknadstekst', '15')}

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Kontaktperson: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Kontaktperson'}
              name="responsible"
              component={SelectInput.Field}
              options={
                company
                  ? [{ label: 'Ingen', value: -1 }].concat(
                      (company.companyContacts || [])
                        .map(contact => ({
                          label: contact.name,
                          value: contact.id
                        }))
                    )
                  : [{ label: 'Ingen', value: -1 }]
              }
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
  pure: false,
  validate(values) {
    const errors = {};
    if (!values.title) {
      errors.title = 'Du må gi jobbannonsen en tittel';
    }
    if (!values.company) {
      errors.company = 'Du må angi en bedrift for jobbannonsen';
    }
    if (parseInt(values.fromYear, 10) > parseInt(values.toYear, 10)) {
      errors.toYear = "'Til år' kan ikke være lavere enn 'Fra år'";
    }
    const visibleFrom = moment.tz(values.visibleFrom, config.timezone);
    const visibleTo = moment.tz(values.visibleTo, config.timezone);
    if (visibleFrom > visibleTo) {
      errors.visibleTo = 'Sluttidspunkt kan ikke være før starttidspunkt';
    }
    return errors;
  }
})(JoblistingEditor);
