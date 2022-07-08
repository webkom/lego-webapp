// @flow

import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import moment from 'moment-timezone';
import { type FormProps, change, Field, SubmissionError } from 'redux-form';

import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import {
  DatePicker,
  EditorField,
  Form,
  legoForm,
  SelectInput,
  TextInput,
} from 'app/components/Form';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import NavigationTab from 'app/components/NavigationTab';
import type { ID, Joblisting, Workplace } from 'app/models';
import { httpCheck } from 'app/routes/bdb/utils';
import { validYoutubeUrl } from 'app/utils/validation';
import { jobTypes, places, yearValues } from '../constants';

import styles from './JoblistingEditor.css';

type SelectInputObject = {
  label: string,
  value: ID,
};

type Props = {
  joblistingId?: string,
  joblisting: Joblisting,
  handleSubmit: (Function) => void,
  submitJoblisting: (Workplace) => Promise<*>,
  deleteJoblisting: (ID) => Promise<*>,
  event: SelectInputObject,
  dispatch: (any) => void,
  push: (string) => void,
  isNew: boolean,
  fetching: boolean,
  fetchCompanyContacts: ({ companyId: ID }) => Promise<*>,
  company: SelectInputObject,
} & FormProps;

type State = {
  responsibleOptions: Array<Object>,
};

class JoblistingEditor extends Component<Props, State> {
  state = {
    responsibleOptions: [],
  };

  onSubmit = (newJoblisting) => {
    const workplaces = newJoblisting.workplaces
      ? newJoblisting.workplaces.map((obj) => ({ town: obj.value }))
      : null;

    return this.props
      .submitJoblisting({
        ...newJoblisting,
        id: this.props.joblistingId,
        fromYear: newJoblisting.fromYear?.value,
        toYear: newJoblisting.toYear?.value,
        jobType: newJoblisting.jobType?.value,
        applicationUrl:
          newJoblisting.applicationUrl &&
          httpCheck(newJoblisting.applicationUrl),
        workplaces,
      })
      .then((result) => {
        const id = this.props.joblistingId || result.payload.result;
        this.props.push(`/joblistings/${id}/`);
      })
      .catch((err) => {
        if (err.payload && err.payload.response) {
          throw new SubmissionError(err.payload.response.jsonData);
        }
      });
  };

  onDeleteJoblisting = () =>
    this.props.deleteJoblisting(this.props.joblisting.id).then(() => {
      this.props.push('/joblistings/');
    });

  fetchContacts = (company: SelectInputObject) => {
    return this.props
      .fetchCompanyContacts({ companyId: company.value })
      .then((action) => {
        const responsibleOptions = action.payload.map((contact) => ({
          label: contact.name,
          value: contact.id,
        }));
        this.setState({ responsibleOptions });
      });
  };

  componentDidMount() {
    if (!this.props.isNew) {
      this.fetchContacts(this.props.company);
    }
  }

  render() {
    const {
      handleSubmit,
      isNew,
      dispatch,
      fetching = false,
      submitting,
      invalid,
    } = this.props;

    if (!isNew && fetching) {
      return <LoadingIndicator loading />;
    }

    return (
      <Content>
        <Helmet title={!isNew ? 'Rediger jobbannonse' : 'Ny jobbannonse'} />
        <NavigationTab
          title={!isNew ? 'Rediger jobbannonse' : 'Ny jobbannonse'}
          back={{ label: 'Tilbake', path: '/joblistings' }}
        />
        <Form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            placeholder="Tittel"
            label="Tittel"
            name="title"
            component={TextInput.Field}
            required
          />
          <Field
            placeholder="Bedrift"
            label="Bedrift"
            name="company"
            component={SelectInput.AutocompleteField}
            filter={['companies.company']}
            onChange={(event) => {
              // $FlowFixMe
              this.fetchContacts(event).then(() => {
                dispatch(
                  change('joblistingEditor', 'responsible', {
                    label: 'Ingen',
                    value: null,
                  })
                );
              });
            }}
            required
          />
          <Field
            name="jobType"
            label="Jobbtype"
            component={SelectInput.Field}
            placeholder="Jobbtype"
            options={jobTypes}
            required
          />
          <Field
            placeholder="Søknadsfrist"
            label="Søknadsfrist"
            name="deadline"
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
            required
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
            component={SelectInput.Field}
            options={yearValues}
            required
          />
          <Field
            name="toYear"
            label="Til klasse"
            placeholder="Jobbtype"
            component={SelectInput.Field}
            options={yearValues}
            required
          />
          <Field
            placeholder="Søknadslenke"
            label="Søknadslenke"
            name="applicationUrl"
            component={TextInput.Field}
          />
          <Field
            name="contactMail"
            placeholder="E-mail"
            label="Søknadsmail eller kontaktmail"
            component={TextInput.Field}
          />
          <Field
            name="responsible"
            placeholder="Kontaktperson"
            label="Kontaktperson"
            options={this.state.responsibleOptions}
            component={SelectInput.Field}
          />
          <Flex>
            <Field
              name="youtubeUrl"
              label="YouTube-video som cover"
              placeholder="https://www.youtube.com/watch?v=bLHL75H_VEM&t=5"
              component={TextInput.Field}
            />
          </Flex>
          <Field
            name="description"
            className={styles.descriptionField}
            label="Søknadsintro"
            placeholder="Søknadsintro"
            component={EditorField.Field}
            initialized={this.props.initialized}
            required
          />
          <Field
            name="text"
            className={styles.textField}
            placeholder="Søknadstekst"
            label="Søknadstekst:"
            component={EditorField.Field}
            initialized={this.props.initialized}
            required
          />
          <Flex
            className={styles.buttonRow}
            alignItems="baseline"
            justifyContent="flex-end"
          >
            {!isNew && (
              <ConfirmModalWithParent
                title="Slett jobbannonse"
                message="Er du sikker på at du vil slette denne jobbannonsen?"
                onConfirm={this.onDeleteJoblisting}
              >
                <Button danger>Slett</Button>
              </ConfirmModalWithParent>
            )}
            <Button success disabled={invalid || submitting} submit>
              Lagre
            </Button>
          </Flex>
        </Form>
      </Content>
    );
  }
}

const validate = ({
  youtubeUrl,
  title,
  description,
  event,
  fromYear,
  toYear,
  workplaces,
  visibleFrom,
  visibleTo,
  text,
}) => {
  const errors = {};

  const [isValidYoutubeUrl, errorMessage = ''] = validYoutubeUrl()(youtubeUrl);
  if (!isValidYoutubeUrl) {
    errors.youtubeUrl = errorMessage;
  }

  if (!title) {
    errors.title = 'Du må gi jobbannonsen en tittel';
  }
  if (!description || description === '<p></p>') {
    errors.description = 'Du må skrive en søknadsintro';
  }
  if (!text || text === '<p></p>') {
    errors.text = 'Du må skrive en søknadstekst';
  }
  if (!event || event.value == null) {
    errors.event = 'Du må angi en bedrift for jobbannonsen';
  }
  if (parseInt(fromYear, 10) > parseInt(toYear, 10)) {
    errors.toYear = "'Til år' kan ikke være lavere enn 'Fra år'";
  }
  if (!workplaces) {
    errors.workplaces = 'Arbeidssteder kan ikke være tom';
  }

  if (moment(visibleFrom).isAfter(moment(visibleTo))) {
    errors.visibleTo = 'Sluttidspunkt kan ikke være før starttidspunkt';
  }
  return errors;
};

export default legoForm({
  form: 'joblistingEditor',
  enableReinitialize: true,
  validate,
})(JoblistingEditor);
