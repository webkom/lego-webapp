import {
  Button,
  ButtonGroup,
  ConfirmModal,
  Icon,
  LinkButton,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCompanyContacts } from 'app/actions/CompanyActions';
import {
  createJoblisting,
  deleteJoblisting,
  editJoblisting,
  fetchJoblisting,
} from 'app/actions/JoblistingActions';
import {
  TextInput,
  EditorField,
  Form,
  SelectInput,
  LegoFinalForm,
  DatePicker,
} from 'app/components/Form';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectJoblistingById } from 'app/reducers/joblistings';
import { httpCheck } from 'app/routes/bdb/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import time from 'app/utils/time';
import {
  createValidator,
  legoEditorRequired,
  required,
  timeIsAfter,
  validYoutubeUrl,
} from 'app/utils/validation';
import { places, jobTypes, yearValues } from '../constants';
import styles from './JoblistingEditor.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { searchMapping } from 'app/reducers/search';
import type { ListCompany } from 'app/store/models/Company';
import type { DetailedJoblisting } from 'app/store/models/Joblisting';

type SelectInputObject = {
  label: string;
  value: EntityId;
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
      'Sluttidspunkt kan ikke være lavere enn starttidspunkt',
    ),
  ],
  visibleTo: [
    required('Du må velge dato for når jobbannonsen skal slutte å være synlig'),
    timeIsAfter(
      'visibleFrom',
      'Sluttidspunkt kan ikke være lavere enn starttidspunkt',
    ),
  ],
});

const JoblistingEditor = () => {
  const [responsibleOptions, setResponsibleOptions] = useState<
    SelectInputObject[]
  >([]);

  const { joblistingId } = useParams<{ joblistingId: string }>();
  const isNew = joblistingId === undefined;

  const joblisting = useAppSelector((state) =>
    selectJoblistingById<DetailedJoblisting>(state, joblistingId),
  );
  const fetching = useAppSelector((state) => state.joblistings.fetching);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchJoblisting',
    () => joblistingId && dispatch(fetchJoblisting(joblistingId)),
    [joblistingId],
  );

  const onSubmit = async (newJoblisting) => {
    const workplaces = newJoblisting.workplaces
      ? newJoblisting.workplaces.map((obj) => ({
          town: obj.value,
        }))
      : null;

    const payload = {
      ...newJoblisting,
      id: joblistingId,
      fromYear: newJoblisting.fromYear?.value,
      toYear: newJoblisting.toYear?.value,
      jobType: newJoblisting.jobType?.value,
      applicationUrl:
        newJoblisting.applicationUrl && httpCheck(newJoblisting.applicationUrl),
      workplaces,
    };

    const result = await (isNew
      ? dispatch(createJoblisting(payload))
      : dispatch(editJoblisting(payload)));

    const id = joblistingId || result.payload.result;
    navigate(`/joblistings/${id}/`);
  };

  const onDeleteJoblisting = isNew
    ? undefined
    : () =>
        dispatch(deleteJoblisting(joblistingId)).then(() => {
          navigate('/joblistings/');
        });

  const fetchContacts = useCallback(
    (company: (typeof searchMapping)['companies.company'] | ListCompany) => {
      const companyId = 'value' in company ? company.value : company.id;

      return dispatch(fetchCompanyContacts(companyId as EntityId)).then(
        (res) => {
          const responsibleOptions = res.payload.results.map((contact) => ({
            label: contact.name,
            value: contact.id,
          }));
          setResponsibleOptions(responsibleOptions);
        },
      );
    },
    [dispatch],
  );

  usePreparedEffect(
    'fetchContacts',
    () => {
      if (
        !isNew &&
        joblisting?.company &&
        typeof joblisting.company === 'object'
      ) {
        return fetchContacts(joblisting?.company);
      }
    },
    [isNew, joblisting?.company],
  );

  const matchingJobType = jobTypes.find(
    ({ value }) => value === joblisting?.jobType,
  );
  const matchingFromYear = yearValues.find(
    ({ value }) => value === joblisting?.fromYear,
  );
  const matchingToYear = yearValues.find(
    ({ value }) => value === joblisting?.toYear,
  );

  const initialValues = {
    ...joblisting,
    text: joblisting?.text || '<p></p>',
    description: joblisting?.description || '',
    company: joblisting?.company
      ? {
          label: joblisting.company.name,
          value: joblisting.company.id,
        }
      : {},
    visibleFrom: joblisting?.visibleFrom || time({ hours: 12 }),
    visibleTo:
      joblisting?.visibleTo || time({ days: 31, hours: 23, minutes: 59 }),
    deadline:
      joblisting?.deadline || time({ days: 30, hours: 23, minutes: 59 }),
    fromYear: matchingFromYear || yearValues.find(({ value }) => value === 1),
    toYear: matchingToYear || yearValues.find(({ value }) => value === 5),
    jobType:
      matchingJobType || jobTypes.find(({ value }) => value === 'summer_job'),
    responsible: joblisting?.responsible
      ? {
          label: joblisting.responsible.name,
          value: joblisting.responsible.id,
        }
      : {
          label: 'Ingen',
          value: null,
        },
    workplaces: (joblisting?.workplaces || []).map((workplace) => ({
      label: workplace.town,
      value: workplace.town,
    })),
  };

  const title = isNew ? 'Ny jobbannonse' : `Redigerer: ${joblisting?.title}`;

  return (
    <Page
      title={title}
      skeleton={fetching}
      back={{
        href: !isNew ? `/joblistings/${joblisting?.slug}` : '/joblistings',
      }}
    >
      <Helmet title={title} />

      <LegoFinalForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
      >
        {({ handleSubmit, form }) => (
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
              required
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
              parse={(value) => value}
            />
            <Field
              name="contactMail"
              placeholder="E-post"
              label="Søknads- eller kontakt-e-post"
              component={TextInput.Field}
              parse={(value) => value}
            />
            <Field
              name="responsible"
              placeholder="Kontaktperson"
              label="Kontaktperson"
              options={responsibleOptions}
              component={SelectInput.Field}
              isClearable
            />
            <Field
              name="youtubeUrl"
              label="YouTube-video som cover"
              placeholder="https://www.youtube.com/watch?v=bLHL75H_VEM&t=5"
              component={TextInput.Field}
              parse={(value) => value}
            />
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
              label="Søknadstekst"
              component={EditorField.Field}
              initialized
              required
            />
            <SubmissionError />
            <ButtonGroup>
              <LinkButton href={`/joblistings/${isNew ? '' : joblistingId}`}>
                Avbryt
              </LinkButton>
              <SubmitButton>
                {isNew ? 'Opprett' : 'Lagre endringer'}
              </SubmitButton>
              {!isNew && (
                <ConfirmModal
                  title="Slett jobbannonse"
                  message="Er du sikker på at du vil slette denne jobbannonsen?"
                  onConfirm={onDeleteJoblisting}
                >
                  {({ openConfirmModal }) => (
                    <Button onPress={openConfirmModal} danger>
                      <Icon iconNode={<Trash2 />} size={19} />
                      Slett jobbannonse
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </ButtonGroup>
          </Form>
        )}
      </LegoFinalForm>
    </Page>
  );
};

export default JoblistingEditor;
