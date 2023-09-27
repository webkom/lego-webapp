import {
  Button,
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import {
  TextInput,
  EditorField,
  Form,
  SelectInput,
  LegoFinalForm,
  DatePicker,
} from 'app/components/Form';
import NavigationTab from 'app/components/NavigationTab';
import { httpCheck } from 'app/routes/bdb/utils';
import {
  createValidator,
  legoEditorRequired,
  required,
  timeIsAfter,
  validYoutubeUrl,
} from 'app/utils/validation';
import { places, jobTypes, yearValues } from '../constants';
import styles from './JoblistingEditor.css';
import type { ID } from 'app/store/models';
import type {
  DetailedJoblisting,
  Workplace,
} from 'app/store/models/Joblisting';
import type { History } from 'history';

type SelectInputObject = {
  label: string;
  value: ID;
};

type Props = {
  joblistingId?: string;
  joblisting: DetailedJoblisting;
  submitJoblisting: (arg0: Workplace) => Promise<any>;
  deleteJoblisting: (arg0: ID) => Promise<any>;
  event: SelectInputObject;
  dispatch: (arg0: any) => void;
  push: History['push'];
  isNew: boolean;
  fetching: boolean;
  fetchCompanyContacts: (arg0: { companyId: ID }) => Promise<any>;
  company: SelectInputObject;
};

const validate = createValidator({
  youtubeUrl: [validYoutubeUrl()],
  title: [required('Du må gi jobbannonsen en tittel')],
  description: [required('Du må skrive en søknadsintro')],
  text: [legoEditorRequired('Du må skrive en søknadstekst')],
  company: [required('Du må angi en bedrift for jobbannonsen')],
  workplaces: [required('Arbeidssteder kan ikke være tom')],
  toYear: [required('Du må velge sluttår')],
  fromYear: [
    required('Du må velge sluttår'),
    timeIsAfter(
      'toYear',
      'Sluttidspunkt kan ikke være lavere enn starttidspunkt'
    ),
  ],
  visibleTo: [
    required('Du må velge dato for når jobbannonsen skal slutte å være synlig'),
    timeIsAfter(
      'visibleFrom',
      'Sluttidspunkt kan ikke være lavere enn starttidspunkt'
    ),
  ],
});

const JoblistingEditor = (props: Props) => {
  const [responsibleOptions, setResponsibleOptions] = useState([]);

  const onSubmit = (newJoblisting) => {
    const workplaces = newJoblisting.workplaces
      ? newJoblisting.workplaces.map((obj) => ({
          town: obj.value,
        }))
      : null;

    return props
      .submitJoblisting({
        ...newJoblisting,
        id: props.joblistingId,
        fromYear: newJoblisting.fromYear?.value,
        toYear: newJoblisting.toYear?.value,
        jobType: newJoblisting.jobType?.value,
        applicationUrl:
          newJoblisting.applicationUrl &&
          httpCheck(newJoblisting.applicationUrl),
        workplaces,
      })
      .then((result) => {
        const id = props.joblistingId || result.payload.result;
        props.push(`/joblistings/${id}/`);
      })
      .catch((err) => {
        if (err.payload && err.payload.response) {
          throw new SubmissionError(err.payload.response.jsonData);
        }
      });
  };

  const onDeleteJoblisting = () =>
    props.deleteJoblisting(props.joblisting.id).then(() => {
      props.push('/joblistings/');
    });

  const fetchContacts = (company: SelectInputObject) => {
    return props
      .fetchCompanyContacts({
        companyId: company.value,
      })
      .then((action) => {
        const responsibleOptions = action.payload.map((contact) => ({
          label: contact.name,
          value: contact.id,
        }));
        setResponsibleOptions(responsibleOptions);
      });
  };

  useEffect(() => {
    if (!props.isNew) {
      fetchContacts(props.company);
    }
  }, []);

  const { isNew, fetching = false, push } = props;

  if (!isNew && fetching) {
    return <LoadingIndicator loading />;
  }

  return (
    <Content>
      <Helmet title={!isNew ? 'Rediger jobbannonse' : 'Ny jobbannonse'} />
      <NavigationTab
        title={!isNew ? 'Rediger jobbannonse' : 'Ny jobbannonse'}
        back={{
          label: 'Tilbake',
          path: !isNew
            ? `/joblistings/${props.joblisting.slug}`
            : '/joblistings',
        }}
      />

      <LegoFinalForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={props.initialValues}
      >
        {({ handleSubmit, submitting, pristine, form }) => (
          <Form onSubmit={handleSubmit}>
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
                fetchContacts(event).then(() => {
                  form.change('joblistingEditor', {
                    label: 'Ingen',
                    value: null,
                  });
                  form.change('responsible', {
                    label: 'Ingen',
                    value: null,
                  });
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
              label="For klassetrinn fra"
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
              placeholder="E-post"
              label="Søknadsmail eller kontaktmail"
              component={TextInput.Field}
            />
            <Field
              name="responsible"
              placeholder="Kontaktperson"
              label="Kontaktperson"
              options={responsibleOptions}
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
              initialized
              required
            />
            <Field
              name="text"
              className={styles.textField}
              placeholder="Søknadstekst"
              label="Søknadstekst:"
              component={EditorField.Field}
              initialized
              required
            />
            <Flex wrap>
              <Button
                onClick={() =>
                  push(`/joblistings/${isNew ? '' : props.joblisting.id}`)
                }
              >
                Avbryt
              </Button>
              <Button disabled={submitting || pristine} submit>
                {isNew ? 'Opprett' : 'Lagre endringer'}
              </Button>
              {!isNew && (
                <ConfirmModal
                  title="Slett jobbannonse"
                  message="Er du sikker på at du vil slette denne jobbannonsen?"
                  onConfirm={onDeleteJoblisting}
                >
                  {({ openConfirmModal }) => (
                    <Button onClick={openConfirmModal} danger>
                      <Icon name="trash" size={19} />
                      Slett jobbannonse
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </Flex>
          </Form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default JoblistingEditor;
