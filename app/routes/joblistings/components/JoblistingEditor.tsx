import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
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
import { Content } from 'app/components/Content';
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
import NavigationTab from 'app/components/NavigationTab';
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
import type { ID } from 'app/store/models';

type SelectInputObject = {
  label: string;
  value: ID;
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

const JoblistingEditor = () => {
  const [responsibleOptions, setResponsibleOptions] = useState<
    SelectInputObject[]
  >([]);

  const { joblistingId } = useParams<{ joblistingId: string }>();
  const isNew = joblistingId === undefined;

  const joblisting = useAppSelector((state) =>
    selectJoblistingById(state, {
      joblistingId,
    })
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchJoblisting',
    () => joblistingId && dispatch(fetchJoblisting(joblistingId)),
    [joblistingId]
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
    (company: SelectInputObject) => {
      return dispatch(
        fetchCompanyContacts({
          companyId: company.id,
        })
      ).then((action) => {
        const responsibleOptions = action.payload.map((contact) => ({
          label: contact.name,
          value: contact.id,
        }));
        setResponsibleOptions(responsibleOptions);
      });
    },
    [dispatch]
  );

  usePreparedEffect(
    'fetchContacts',
    () => {
      if (!isNew && joblisting?.company) {
        fetchContacts(joblisting?.company);
      }
    },
    [isNew, joblisting?.company]
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
    fromYear: yearValues.find(
      ({ value }) => value === joblisting?.fromYear || value === 1
    ),
    toYear: yearValues.find(
      ({ value }) => value === joblisting?.toYear || value === 5
    ),
    jobType: jobTypes.find(
      ({ value }) => value === joblisting?.jobType || value === 'summer_job'
    ),
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

  const title = isNew ? 'Ny jobbannonse' : joblisting?.title;

  return (
    <Content>
      <Helmet title={title} />
      <NavigationTab
        title={title}
        back={{
          label: 'Tilbake',
          path: !isNew ? `/joblistings/${joblisting?.slug}` : '/joblistings',
        }}
      />

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
            <SubmissionError />
            <Flex wrap>
              <Button
                onClick={() =>
                  navigate(`/joblistings/${isNew ? '' : joblistingId}`)
                }
              >
                Avbryt
              </Button>
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
