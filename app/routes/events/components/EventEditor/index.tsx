import {
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
  Modal,
} from '@webkom/lego-bricks';
import arrayMutators from 'final-form-arrays';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Content,
  ContentSection,
  ContentMain,
  ContentSidebar,
} from 'app/components/Content';
import {
  Form,
  EditorField,
  SelectInput,
  TextInput,
  TextEditor,
  CheckBox,
  Button,
  DatePicker,
  ImageUploadField,
  LegoFinalForm,
} from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { Image } from 'app/components/Image';
import MazemapLink from 'app/components/MazemapEmbed/MazemapLink';
import NavigationTab from 'app/components/NavigationTab';
import Tag from 'app/components/Tags/Tag';
import { FormatTime } from 'app/components/Time';
import { AttendanceStatus } from 'app/components/UserAttendance';
import AttendanceModal from 'app/components/UserAttendance/AttendanceModal';
import {
  EVENT_CONSTANTS,
  colorForEvent,
  eventStatusTypes,
} from 'app/routes/events/utils';
import {
  atLeastOneFieldRequired,
  conditionalValidation,
  createValidator,
  isInteger,
  maxSize,
  mergeTimeAfterAllPoolsActivation,
  minSize,
  required,
  requiredIf,
  timeIsAfter,
  timeIsAtLeastDurationAfter,
  validYoutubeUrl,
} from 'app/utils/validation';
import Admin from '../Admin';
import styles from './EventEditor.css';
import renderPools from './renderPools';
import type {
  ID,
  EventRegistration,
  ActionGrant,
  ImageGallery,
} from 'app/models';
import type { EditingEvent } from 'app/routes/events/utils';
import type { History } from 'history';
import type { FormEventHandler } from 'react';

type Props = {
  eventId: number;
  event: EditingEvent;
  actionGrant: ActionGrant;
  loading: boolean;
  waitingRegistrations: EventRegistration[];
  isUserInterested: boolean;
  handleSubmit: FormEventHandler;
  handleSubmitCallback: (arg0: any) => Promise<any>;
  uploadFile: () => Promise<any>;
  deleteEvent: (eventId: ID) => Promise<any>;
  push: History['push'];
  imageGallery: ImageGallery;
  change: (key: string, token: string) => void;
  setSaveForUse: (key: string, token: string, value: boolean) => Promise<any>;
  initialValues: EditingEvent;
};

const TypedLegoForm = LegoFinalForm<EditingEvent>;

const validate = createValidator({
  youtubeUrl: [validYoutubeUrl()],
  title: [required('Tittel er påkrevd')],
  description: [required('Kalenderbeskrivelse er påkrevd')],
  eventType: [required('Arrangementstype er påkrevd')],
  location: [
    atLeastOneFieldRequired(
      ['location', 'mazemapPoi'],
      'Sted eller MazeMap-rom er påkrevd'
    ),
  ],
  cover: [required('Cover er påkrevd')],
  eventStatusType: [required('Påmeldingstype er påkrevd')],
  priceMember: [
    requiredIf((allValues) => allValues.isPriced, 'Pris er påkrevd'),
    conditionalValidation(
      (allValues) => allValues.isPriced,
      () => [
        minSize(0, 'Prisen må være større enn 0'),
        maxSize(10000, 'Prisen kan ikke være større enn 10000'),
      ]
    ),
  ],
  paymentDueDate: [
    timeIsAtLeastDurationAfter(
      'unregistrationDeadline',
      moment.duration(1, 'day'),
      'Betalingsfristen må være minst 24 timer etter avregistreringsfristen'
    ),
  ],
  isClarified: [
    requiredIf(
      (allValues) =>
        // Only require if we are creating a new event
        allValues.id === undefined,
      'Arrangementet må være avklart'
    ),
  ],
  feedbackDescription: [
    requiredIf(
      (allValues) => allValues.hasFeedbackQuestion,
      'Spørsmål er påkrevd'
    ),
  ],
  registrationDeadlineHours: [isInteger('Kun hele timer')],
  unregistrationDeadlineHours: [isInteger('Kun hele timer')],
  endTime: [
    timeIsAfter('startTime', 'Sluttidspunkt kan ikke være før starttidspunkt'),
  ],
  mergeTime: [
    mergeTimeAfterAllPoolsActivation(
      'Sammenslåingstidspunkt satt før aktiveringspunkt i en av poolene'
    ),
  ],
});

function EventEditor({
  event,
  eventId,
  actionGrant,
  uploadFile,
  push,
  imageGallery,
  change,
  setSaveForUse,
  initialValues,
  ...props
}: Props) {
  const isEditPage = eventId !== undefined;
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [useImageGallery, setUseImageGallery] = useState(false);
  const [imageGalleryUrl, setImageGalleryUrl] = useState('');

  if (isEditPage && !actionGrant.includes('edit')) {
    return null;
  }

  if (isEditPage && Object.keys(event).length === 0) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = (values: EditingEvent) => {
    props.handleSubmit(values);

    const key: string = values.cover.split(':')[0];
    const token: string = values.cover.split(':')[1];
    if (values.saveToImageGallery) {
      setSaveForUse(key, token, true);
    }
  };

  const isTBA = (value) =>
    value && value === 'TBA' ? `Velg påmeldingstype TBA` : undefined;

  const containsAllergier = (value) =>
    value && value.toLowerCase().indexOf('allergi') !== -1
      ? `Matallergier/preferanser kan hentes fra adminsidene til arrangementet`
      : undefined;

  const tooLow = (value) =>
    value && value <= 3 ? `Summen må være større enn 3 kr` : undefined;

  const title = isEditPage ? `Redigerer: ${event.title}` : 'Nytt arrangement';

  return (
    <Content>
      <Helmet title={title} />
      <NavigationTab
        title={title}
        back={{
          label: 'Tilbake',
          path: isEditPage ? `/events/${event.slug}` : '/events',
        }}
      />

      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
      >
        {({ handleSubmit, values }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              name="cover"
              component={ImageUploadField}
              aspectRatio={20 / 6}
              img={useImageGallery ? imageGalleryUrl : event.cover}
            />

            <Modal
              show={showImageGallery}
              onHide={() => setShowImageGallery(false)}
              contentClassName={styles.imageGallery}
            >
              <>
                <h1>Bildegalleri</h1>
                <Flex
                  wrap
                  alignItems="center"
                  justifyContent="space-around"
                  gap="1rem"
                >
                  {imageGallery?.map((e) => (
                    <Flex key={e.key} alignItems="center" gap="1rem">
                      <Image
                        src={e.cover}
                        placeholder={e.coverPlaceholder}
                        alt={`${e.cover} bilde`}
                        onClick={() => {
                          change('cover', `${e.key}:${e.token}`);
                          setShowImageGallery(false);
                          setUseImageGallery(true);
                          setImageGalleryUrl(e.cover);
                        }}
                        className={styles.imageGalleryEntry}
                      />
                      <ConfirmModal
                        title="Fjern fra galleri"
                        message={`Er du sikker på at du vil fjerne bildet fra bildegalleriet? Bildet blir ikke slettet fra databasen.`}
                        closeOnConfirm
                        onConfirm={() => setSaveForUse(e.key, e.token, false)}
                      >
                        {({ openConfirmModal }) => (
                          <Icon
                            onClick={openConfirmModal}
                            name="trash"
                            danger
                          />
                        )}
                      </ConfirmModal>
                    </Flex>
                  ))}
                  {imageGallery.length === 0 && (
                    <Flex
                      column
                      alignItems="center"
                      gap={5}
                      className={styles.emptyGallery}
                    >
                      <Icon name="folder-open-outline" size={50} />
                      <b>Bildegalleriet er tomt ...</b>
                      <span>Hvorfor ikke laste opp et bilde?</span>
                    </Flex>
                  )}
                </Flex>
              </>
            </Modal>

            <Flex alignItems="center" justifyContent="space-between">
              <Button onClick={() => setShowImageGallery(true)}>
                Velg bilde fra bildegalleriet
              </Button>
              <div>
                <Field
                  label="Lagre til bildegalleriet"
                  description="Lagre bildet til bildegalleriet slik at det kan bli brukt til andre arrangementer"
                  name="saveToImageGallery"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={(v) => !!v}
                />
              </div>
            </Flex>

            <Field
              name="youtubeUrl"
              label="Erstatt cover-bildet med video fra YouTube"
              description="Videoen erstatter ikke coveret i listen over arrangementer"
              placeholder="https://www.youtube.com/watch?v=bLHL75H_VEM&t=5"
              component={TextInput.Field}
            />
            <Field
              label="Festet på forsiden"
              name="pinned"
              component={CheckBox.Field}
              fieldClassName={styles.metaField}
              className={styles.formField}
              normalize={(v) => !!v}
            />
            <Field
              label="Tittel"
              name="title"
              placeholder="Tittel"
              style={{
                borderBottom: `3px solid ${colorForEvent(
                  values.eventType?.value
                )}`,
              }}
              component={TextInput.Field}
            />
            <Field
              name="description"
              label="Kalenderbeskrivelse"
              placeholder="Kom på fest den ..."
              component={TextEditor.Field}
            />

            <ContentSection>
              <ContentMain>
                <Field
                  name="text"
                  component={EditorField.Field}
                  label="Hovedbeskrivelse"
                  placeholder="Dette blir tidenes fest ..."
                  className={styles.descriptionEditor}
                  uploadFile={uploadFile}
                  initialized={!!event}
                />
                <Flex className={styles.tagRow}>
                  {(values.tags || []).map((tag, i) => (
                    <Tag key={i} tag={tag} />
                  ))}
                </Flex>
              </ContentMain>
              <ContentSidebar>
                <Field
                  name="eventType"
                  label="Type arrangement"
                  fieldClassName={styles.metaField}
                  component={SelectInput.Field}
                  options={Object.keys(EVENT_CONSTANTS).map((type) => ({
                    label: EVENT_CONSTANTS[type],
                    value: type,
                  }))}
                  placeholder="Arrangementstype"
                />
                <Field
                  name="company"
                  label="Arrangerende bedrift"
                  filter={['companies.company']}
                  fieldClassName={styles.metaField}
                  component={SelectInput.AutocompleteField}
                  placeholder="Bedrift"
                />
                <Field
                  name="responsibleGroup"
                  label="Ansvarlig gruppe"
                  filter={['users.abakusgroup']}
                  fieldClassName={styles.metaField}
                  component={SelectInput.AutocompleteField}
                  placeholder="Ansvar for arrangement"
                />
                <Field
                  name="responsibleUsers"
                  label="Ansvarlige brukere"
                  filter={['users.user']}
                  fieldClassName={styles.metaField}
                  component={SelectInput.AutocompleteField}
                  isMulti
                  placeholder="Velg ansvarlige brukere"
                />
                <Field
                  label="Starter"
                  name="startTime"
                  component={DatePicker.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                />
                <Field
                  label="Slutter"
                  name="endTime"
                  component={DatePicker.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                />
                <Field
                  label="Bruk MazeMap"
                  name="useMazemap"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={(v) => !!v}
                />
                {!values.useMazemap ? (
                  <Field
                    label="Sted"
                    name="location"
                    placeholder="Den Gode Nabo, Downtown, ..."
                    component={TextInput.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    warn={isTBA}
                  />
                ) : (
                  <Flex alignItems="flex-end">
                    <Field
                      label="MazeMap-rom"
                      name="mazemapPoi"
                      component={SelectInput.MazemapAutocomplete}
                      fieldClassName={styles.metaField}
                      placeholder="R1, Abakus, Kjel4 ..."
                    />
                    {values.mazemapPoi?.value && (
                      <MazemapLink
                        mazemapPoi={values.mazemapPoi?.value}
                        linkText="↗️"
                      />
                    )}
                  </Flex>
                )}
                <Field
                  label="Fremmedspråklig"
                  description="Arrangementet er på et annet språk enn norsk (engelsk)"
                  name="isForeignLanguage"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={(v) => !!v}
                />
                <Field
                  label="Kun for spesifikk gruppe"
                  description="Gjør arrangementet synlig for kun medlemmer i spesifikke grupper"
                  name="isGroupOnly"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={(v) => !!v}
                />
                {values.isGroupOnly && (
                  <div className={styles.subSection}>
                    <Field
                      name="canViewGroups"
                      placeholder="Velg grupper"
                      filter={['users.abakusgroup']}
                      fieldClassName={styles.metaField}
                      component={SelectInput.AutocompleteField}
                      isMulti
                    />
                  </div>
                )}
                <Field
                  label="Påmeldingstype"
                  name="eventStatusType"
                  component={SelectInput.Field}
                  fieldClassName={styles.metaField}
                  options={eventStatusTypes}
                />
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType?.value
                ) && (
                  <Field
                    label="Betalt arrangement"
                    name="isPriced"
                    component={CheckBox.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    normalize={(v) => !!v}
                  />
                )}
                {values.isPriced && (
                  <div className={styles.subSection}>
                    <Field
                      label="Betaling via Abakus.no"
                      description="Manuell betaling kan også godkjennes av oss i etterkant"
                      name="useStripe"
                      component={CheckBox.Field}
                      fieldClassName={styles.metaField}
                      className={styles.formField}
                      normalize={(v) => !!v}
                    />
                    <Field
                      label="Pris"
                      name="priceMember"
                      type="number"
                      component={TextInput.Field}
                      fieldClassName={styles.metaField}
                      className={styles.formField}
                      warn={tooLow}
                    />
                    <Field
                      label="Betalingsfrist"
                      name="paymentDueDate"
                      component={DatePicker.Field}
                      fieldClassName={styles.metaField}
                      className={styles.formField}
                    />
                  </div>
                )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType?.value
                ) && (
                  <Field
                    label="Bruk prikker"
                    name="heedPenalties"
                    component={CheckBox.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    normalize={(v) => !!v}
                  />
                )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType?.value
                ) &&
                  values.heedPenalties && (
                    <div className={styles.subSection}>
                      <Field
                        key="unregistrationDeadline"
                        label="Avregistreringsfrist"
                        description="Frist for avmelding - fører til prikk etterpå"
                        name="unregistrationDeadline"
                        component={DatePicker.Field}
                        fieldClassName={styles.metaField}
                        className={styles.formField}
                      />
                    </div>
                  )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType?.value
                ) && (
                  <Field
                    label="Separat avregistreringsfrist"
                    description="Separate frister for påmelding og avmelding - antall timer før arrangementet. Det vil ikke være mulig å melde seg av eller på etter de satte fristene (negativ verdi betyr antall timer etter starten på arrangementet)"
                    name="separateDeadlines"
                    component={CheckBox.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    normalize={(v) => !!v}
                  />
                )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType?.value
                ) &&
                  values.separateDeadlines && (
                    <div className={styles.subSection}>
                      <Field
                        key="unregistrationDeadlineHours"
                        label="Avregistrering antall timer før"
                        description="Frist for avmelding antall timer før arrangementet (negativ verdi betyr antall timer etter starten på arrangementet)"
                        name="unregistrationDeadlineHours"
                        type="number"
                        component={TextInput.Field}
                        fieldClassName={styles.metaField}
                        className={styles.formField}
                      />
                    </div>
                  )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType?.value
                ) && (
                  <>
                    <Field
                      key="registrationDeadlineHours"
                      label="Registrering antall timer før"
                      description="Frist for påmelding/avmelding - antall timer før arrangementet. Det er ikke mulig å melde seg hverken på eller av etter denne fristen (negativ verdi betyr antall timer etter starten på arrangementet)"
                      name="registrationDeadlineHours"
                      type="number"
                      component={TextInput.Field}
                      fieldClassName={styles.metaField}
                      className={styles.formField}
                    />
                    <p className={styles.registrationDeadlineHours}>
                      Stenger{' '}
                      <FormatTime time={moment(values.registrationDeadline)} />
                    </p>
                  </>
                )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType && values.eventStatusType.value
                ) && (
                  <Field
                    label="Samtykke til bilder"
                    description="Bruk samtykke til bilder"
                    name="useConsent"
                    component={CheckBox.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    normalize={(v) => !!v}
                  />
                )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType && values.eventStatusType.value
                ) && (
                  <Field
                    label="Informasjon kan deles til smittesporing"
                    description="Navn, telefonnummer og e-post kan deles med folk utenfor Abakus til smittesporing. Dersom informasjonen skal kunne deles med andre enn FHI og NTNU, må dette spesifiseres i beskrivelsen."
                    name="useContactTracing"
                    component={CheckBox.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    normalize={(v) => !!v}
                    disabled={moment().isAfter(values.activationTime)}
                  />
                )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType && values.eventStatusType.value
                ) && (
                  <Field
                    label="Påmeldingsspørsmål"
                    description="Still et spørsmål ved påmelding"
                    name="hasFeedbackQuestion"
                    component={CheckBox.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    normalize={(v) => !!v}
                  />
                )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType && values.eventStatusType.value
                ) &&
                  values.hasFeedbackQuestion && (
                    <div className={styles.subSection}>
                      <Field
                        name="feedbackDescription"
                        placeholder="Burger eller sushi?"
                        component={TextInput.Field}
                        fieldClassName={styles.metaField}
                        className={styles.formField}
                        warn={containsAllergier}
                      />
                      <Field
                        name="feedbackRequired"
                        label="Obligatorisk"
                        component={CheckBox.Field}
                        fieldClassName={styles.metaField}
                        className={styles.formField}
                        normalize={(v) => !!v}
                      />
                    </div>
                  )}
                {['NORMAL', 'INFINITE'].includes(
                  values.eventStatusType && values.eventStatusType.value
                ) && (
                  <Flex column>
                    <h3>Pools</h3>
                    <AttendanceModal
                      key="modal"
                      pools={values.pools || []}
                      title="Påmeldte"
                    >
                      {({ toggleModal }) => (
                        <AttendanceStatus
                          toggleModal={toggleModal}
                          pools={values.pools}
                        />
                      )}
                    </AttendanceModal>
                    <div className={styles.metaList}>
                      <FieldArray
                        name="pools"
                        // validate={validatePools}
                        component={renderPools}
                        startTime={values.startTime}
                        eventStatusType={values.eventStatusType?.value}
                      />
                    </div>
                    {values.pools?.length > 1 && (
                      <Field
                        label="Sammenslåingstidspunkt"
                        description="Tidspunkt for å slå sammen poolene"
                        name="mergeTime"
                        component={DatePicker.Field}
                        fieldClassName={styles.metaField}
                        className={styles.formField}
                      />
                    )}
                    {isEditPage && (
                      <Admin actionGrant={actionGrant} event={values} />
                    )}
                  </Flex>
                )}
              </ContentSidebar>
            </ContentSection>

            {!isEditPage && (
              <Field
                label={
                  <>
                    Arrangementet er avklart i{' '}
                    <Link to="/pages/arrangementer/86-arrangementskalender">
                      arrangementskalenderen
                    </Link>
                  </>
                }
                description={
                  <>
                    Jeg er kjent med at jeg kun kan bruke rettighetene mine til
                    å opprette et Abakusarrangement som er i tråd med{' '}
                    <Link
                      style={{ display: 'contents' }}
                      to="/pages/arrangementer/86-arrangementskalender"
                    >
                      arrangementskalenderen
                    </Link>{' '}
                    og Abakus sine blesteregler, og at jeg må ta kontakt med{' '}
                    <a
                      style={{ display: 'contents' }}
                      href="mailto:hs@abakus.no"
                    >
                      hs@abakus.no
                    </a>{' '}
                    dersom jeg er usikker eller ønsker å opprette et
                    annet/eksternt arrangement.
                  </>
                }
                name="isClarified"
                component={CheckBox.Field}
                fieldClassName={styles.metaFieldInformation}
                className={styles.formField}
                normalize={(v) => !!v}
              />
            )}

            <Flex wrap>
              {isEditPage && (
                <Button flat onClick={() => push(`/events/${event.slug}`)}>
                  Avbryt
                </Button>
              )}
              <SubmitButton>
                {isEditPage ? 'Lagre endringer' : 'Opprett'}
              </SubmitButton>
            </Flex>
          </Form>
        )}
      </TypedLegoForm>
    </Content>
  );
}

export default EventEditor;
