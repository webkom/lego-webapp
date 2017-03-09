import React from 'react';
import styles from './JoblistingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field } from 'redux-form';
import { Form, TextEditor, TextInput, DatePicker, SelectInput } from 'app/components/Form';
import Button from 'app/components/Button';
import moment from 'moment';
import config from 'app/config';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';

type Props = {
  handleSubmitCallback: () => void,
  joblistingId?: string,
  joblisting?: Object,
  handleSubmit: () => void,
  onQueryChanged: () => void
};

function JoblistingEditor({ handleSubmit, results, handleSubmitCallback, joblistingId, joblisting, onQueryChanged }: Props) {
  const isEditPage = (joblistingId !== undefined);
  if (isEditPage && !joblisting) {
    return <LoadingIndicator loading />;
  }
  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>
        {isEditPage ? 'Rediger jobbannonse' : 'Legg til jobbannonse'}
      </h1>
      <Form onSubmit={handleSubmit(handleSubmitCallback)}>
        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Tittel: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Tittel'}
              name='title'
              component={TextInput.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Bedrift: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Bedrift'}
              name='company.name'
              component={SelectInput}
              options={results}
              optionValue='param'
              optionLabel='title'
              onSearch={(query) => onQueryChanged(query)}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Deadline: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              name='deadline'
              component={DatePicker.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Synlig fra: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              name='visibleFrom'
              component={DatePicker.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Synlig til: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              name='visibleTo'
              component={DatePicker.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Jobbtype: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <select
              name='jobType'
              defaultValue='summerJob'
            >
              <option value='summerJob'>Sommerjobb</option>
              <option value='partTime'>Deltid</option>
              <option value='fullTime'>Fulltid</option>
            </select>
            <Field
              placeholder={'Jobbtype'}
              name='company.name'
              component={SelectInput}
              options={results}
              optionValue='param'
              optionLabel='title'
              onSearch={(query) => onQueryChanged(query)}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Arbeidssteder: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Arbeidssteder'}
              name='workplaces'
              component={TextInput.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Fra år: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <select
              name='fromYear'
              defaultValue='1'
            >
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Til år: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <select
              name='toYear'
              defaultValue='5'
            >
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Søknadslenke: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Søknadslenke'}
              name='applicationUrl'
              component={TextInput.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Søknadsintro: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Søknadsintro'}
              name='description'
              rows='7'
              component={TextEditor.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Søknadstekst: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Søknadstekst'}
              name='text'
              rows='15'
              component={TextEditor.Field}
            />
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Kontaktperson: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Kontaktperson'}
              name='responsible.name'
              component={TextInput.Field} // Get list of current, possible to create new, fix later
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
