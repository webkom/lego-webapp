import React from 'react';
import styles from './JoblistingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field, change } from 'redux-form';
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
    submitJoblisting,
    company,
    fetchCompany,
    dispatch
  }: Props
) {
  const isEditPage = joblistingId !== undefined;
  if (isEditPage && !joblisting) {
    return <LoadingIndicator loading />;
  }
  const onSubmit2 = newJoblisting => {
    const workplaces = newJoblisting.workplaces
      ? newJoblisting.workplaces.split(',').map(town2 => ({ town: town2 }))
      : null;
    const responsible = newJoblisting.responsible &&
      (newJoblisting.responsible === 'Ingen' ||
        newJoblisting.responsible.id === -1)
      ? null
      : newJoblisting.responsible ? newJoblisting.responsible.id : null;
    const company = newJoblisting.company.id;
    submitJoblisting({
      ...newJoblisting,
      company,
      workplaces,
      responsible
    });
  };
  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>
        {isEditPage ? 'Rediger jobbannonse' : 'Legg til jobbannonse'}
      </h1>
      <Form onSubmit={handleSubmit(onSubmit2)}>
        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Tittel: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Tittel'}
              name="title"
              component={TextInput.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Bedrift: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Bedrift'}
              name="company"
              component={SelectInput}
              options={results}
              optionValue="param"
              optionLabel="title"
              displayValue="name"
              onSearch={query => onQueryChanged(query)}
              valueMapping={{
                id: 'param',
                name: 'title'
              }}
              onChange={newValue => {
                if (!company || Number(newValue.id) !== company.id) {
                  fetchCompany(newValue.id);
                  dispatch(change('joblistingEditor', 'responsible', 'Ingen'));
                }
              }}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Deadline: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field name="deadline" component={DatePicker.Field} />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Synlig fra: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field name="visibleFrom" component={DatePicker.Field} />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Synlig til: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field name="visibleTo" component={DatePicker.Field} />
          </FlexColumn>
        </FlexRow>

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
              component={TextInput.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Fra år: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field name="fromYear" component="select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Field>
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Til år: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field name="toYear" component="select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Field>
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Søknadslenke: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Søknadslenke'}
              name="applicationUrl"
              component={TextInput.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Søknadsintro: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Søknadsintro'}
              name="description"
              rows="7"
              component={TextEditor.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Søknadstekst: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Søknadstekst'}
              name="text"
              rows="15"
              component={TextEditor.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Kontaktperson: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Kontaktperson'}
              name="responsible"
              component={SelectInput}
              options={
                company
                  ? [{ id: -1, name: 'Ingen' }].concat(company.companyContacts)
                  : [{ id: -1, name: 'Ingen' }]
              }
              optionValue="id"
              optionLabel="name"
              displayValue="name"
              valueMapping={{
                id: 'id',
                name: 'name'
              }}
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
