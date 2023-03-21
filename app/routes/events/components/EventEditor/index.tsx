import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Field, FieldArray } from 'redux-form';
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
  legoForm,
} from 'app/components/Form';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import MazemapLink from 'app/components/MazemapEmbed/MazemapLink';
import Modal from 'app/components/Modal';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import NavigationTab from 'app/components/NavigationTab';
import Tag from 'app/components/Tags/Tag';
import { FormatTime } from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import {
  AttendanceStatus,
  ModalParentComponent,
} from 'app/components/UserAttendance';
import type {
  ID,
  EventRegistration,
  EventPool,
  ActionGrant,
  imageGallery,
} from 'app/models';
import { validYoutubeUrl } from 'app/utils/validation';
import {
  addStripeFee,
  EVENT_CONSTANTS,
  colorForEvent,
  eventStatusTypes,
} from '../../utils';
import Admin from '../Admin';
import styles from './EventEditor.css';
import renderPools, { validatePools } from './renderPools';

import type { EditingEvent } from '../../utils';
import type { FormEventHandler } from 'react';

type Props = {
  eventId: number;
  event: EditingEvent;
  actionGrant: ActionGrant;
  error?: Record<string, any>;
  loading: boolean;
  pools: EventPool[];
  registrations: EventRegistration[];
  waitingRegistrations: EventRegistration[];
  isUserInterested: boolean;
  handleSubmit: FormEventHandler;
  handleSubmitCallback: (arg0: any) => Promise<any>;
  uploadFile: () => Promise<any>;
  setCoverPhoto: (arg0: number, arg1: string) => void;
  deleteEvent: (eventId: ID) => Promise<any>;
  submitting: boolean;
  pristine: boolean;
  initialized: boolean;
  push: (arg0: string) => void;
  imageGallery: imageGallery;
  change: (arg0: string, arg1: any) => void;
  setSaveForUse: (arg0: string, arg1: boolean) => Promise<any>;
};

function EventEditor({
  event,
  eventId,
  actionGrant,
  error,
  pools,
  registrations,
  handleSubmit,
  uploadFile,
  setCoverPhoto,
  deleteEvent,
  submitting,
  pristine,
  initialized,
  push,
  imageGallery,
  change,
  setSaveForUse,
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

  if (error) {
    return <div>{error.message}</div>;
  }

  const isTBA = (value) =>
    value && value === 'TBA' ? `Velg påmeldingstype TBA` : undefined;

  const containsAllergier = (value) =>
    value && value.toLowerCase().indexOf('allergi') !== -1
      ? `Matallergier/preferanser kan hentes fra profilene til deltakere`
      : undefined;

  const tooLow = (value) =>
    value && value <= 3 ? `Summen må være større enn 3 kr` : undefined;

  const color = colorForEvent(event.eventType?.value);
  return (
    <Content>
      <Helmet
        title={isEditPage ? `Redigerer: ${event.title}` : 'Nytt arrangement'}
      />
      <NavigationTab
        title={isEditPage ? `Redigerer: ${event.title}` : 'Nytt arrangement'}
        back={{
          label: 'Tilbake',
          path: isEditPage ? `/events/${event.id}` : '/events',
        }}
      />
      <Form onSubmit={handleSubmit}>
        <Field
          name="cover"
          component={ImageUploadField}
          uploadFile={uploadFile}
          aspectRatio={20 / 6}
          img={useImageGallery ? imageGalleryUrl : event.cover}
        />
        <Modal
          show={showImageGallery}
          onHide={() => setShowImageGallery(false)}
          contentClassName={styles.imageGallery}
        >
          <>
            <Flex column alignItems="center">
              <h1>Bildegalleri:</h1>
              <Flex wrap alignItems="center" justifyContent="space-around">
                {imageGallery &&
                  imageGallery.map((e) => {
                    return (
                      <div key={e.key} className={styles.imageGalleryContainer}>
                        <ConfirmModalWithParent
                          title="Fjern fra galleri"
                          message="Er du sikker på at du vil fjerne bildet fra bildegalleriet? (Bildet blir ikke slettet!)"
                          onConfirm={() =>
                            setSaveForUse(`${e.key}:${e.token}`, false)
                          }
                          closeOnConfirm
                        >
                          <button className={styles.closeButton}>
                            <Icon name="close-circle" size={24} />
                          </button>
                        </ConfirmModalWithParent>

                        <img
                          src={`${e.cover}`}
                          key={e.key}
                          onClick={() => {
                            change('cover', `${e.key}:${e.token}`);
                            setShowImageGallery(false);
                            setUseImageGallery(true);
                            setImageGalleryUrl(e.cover);
                          }}
                          className={styles.imageGalleryEntry}
                        />
                      </div>
                    );
                  })}
                {imageGallery.length === 0 && (
                  <h2>
                    Det finnes ingen bilder i bildegalleriet. Hvorfor ikke laste
                    opp ett?
                  </h2>
                )}
              </Flex>
            </Flex>
          </>
        </Modal>

        <Flex wrap alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" justifyContent="space-between">
            <Button
              className={styles.scannerButton}
              onClick={() => setShowImageGallery(true)}
            >
              Velg bilde fra Bildegalleriet
            </Button>
            <Tooltip content="Velg et bilde som er lastet opp og markert for bruk fra tidligere arrangementer.">
              <Icon
                name="information-circle-outline"
                size={20}
                style={{
                  cursor: 'pointer',
                  marginLeft: '0.5em',
                }}
              />
            </Tooltip>
          </Flex>

          <Tooltip content="Lagre bildet til bildegalleriet. Det kan da brukes i andre arrangementer.">
            <Field
              label="Lagre til bildegalleriet"
              name="saveToImageGallery"
              component={CheckBox.Field}
              fieldClassName={styles.metaField}
              className={styles.formField}
              normalize={(v) => !!v}
            />
          </Tooltip>
        </Flex>
        <Flex>
          <Field
            name="youtubeUrl"
            label={
              <Flex alignItems="center" gap={6}>
                <div>Erstatt cover-bildet med video fra YouTube</div>
                <Tooltip content="Valgfritt felt. Videoen erstatter ikke coveret i listen over arrangementer.">
                  <Icon
                    name="information-circle-outline"
                    size={20}
                    style={{
                      cursor: 'pointer',
                    }}
                  />
                </Tooltip>
              </Flex>
            }
            placeholder="https://www.youtube.com/watch?v=bLHL75H_VEM&t=5"
            component={TextInput.Field}
          />
        </Flex>
        <Field
          label="Festet på forsiden"
          name="pinned"
          component={CheckBox.Field}
          fieldClassName={styles.metaField}
          className={styles.formField}
          normalize={(v) => !!v}
        />
        <Flex wrap alignItems="center" justifyContent="space-between">
          <Field
            label="Tittel"
            name="title"
            placeholder="Tittel"
            style={{
              borderBottom: `3px solid ${color}`,
            }}
            component={TextInput.Field}
          />
        </Flex>
        <Field
          name="description"
          label="Kalenderbeskrivelse"
          placeholder="Kom på fest den..."
          component={TextEditor.Field}
        />
        <ContentSection>
          <ContentMain>
            <Field
              name="text"
              component={EditorField.Field}
              label="Hovedbeskrivelse"
              placeholder="Dette blir tidenes fest..."
              className={styles.descriptionEditor}
              uploadFile={uploadFile}
              initialized={initialized}
            />
            <Flex className={styles.tagRow}>
              {(event.tags || []).map((tag, i) => (
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
            <Tooltip content="Kun la medlemmer i bestemt gruppe se arrangementet">
              <Field
                label="Kun for spesifikk gruppe"
                name="isGroupOnly"
                component={CheckBox.Field}
                fieldClassName={styles.metaField}
                className={styles.formField}
                normalize={(v) => !!v}
              />
            </Tooltip>
            {event.isGroupOnly && (
              <div className={styles.subSection}>
                <Field
                  name="canViewGroups"
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
            {['NORMAL', 'OPEN', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
            ) && (
              <Field
                label="Bruk mazemap"
                name="useMazemap"
                component={CheckBox.Field}
                fieldClassName={styles.metaField}
                className={styles.formField}
                normalize={(v) => !!v}
              />
            )}
            {['NORMAL', 'OPEN', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
            ) &&
              (!event.useMazemap ? (
                <Field
                  label="Sted"
                  name="location"
                  placeholder="Den gode nabo, R5, ..."
                  component={TextInput.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  warn={isTBA}
                />
              ) : (
                <Flex alignItems="flex-end">
                  <Field
                    label="Mazemap-rom"
                    name="mazemapPoi"
                    component={SelectInput.MazemapAutocomplete}
                    fieldClassName={styles.metaField}
                    placeholder="R1, Abakus, Kjel4"
                  />
                  {event.mazemapPoi?.value && (
                    <MazemapLink
                      mazemapPoi={event.mazemapPoi?.value}
                      linkText="↗️"
                    />
                  )}
                </Flex>
              ))}
            {['NORMAL', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
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
            {event.isPriced && (
              <div className={styles.subSection}>
                <Tooltip content="Manuell betaling kan også godkjennes av oss i etterkant">
                  <Field
                    label="Betaling via Abakus.no"
                    name="useStripe"
                    component={CheckBox.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    normalize={(v) => !!v}
                  />
                </Tooltip>
                {event.useStripe && (
                  <div className={styles.subSection}>
                    <Tooltip content="Legger automatisk transaksjonskostnaden til prisen">
                      <Field
                        label="Legg til systemgebyr"
                        name="addFee"
                        component={CheckBox.Field}
                        fieldClassName={styles.metaField}
                        className={styles.formField}
                        normalize={(v) => !!v}
                      />
                    </Tooltip>
                  </div>
                )}
                <Field
                  label="Pris medlem"
                  name="priceMember"
                  type="number"
                  component={TextInput.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  warn={tooLow}
                />

                {event.priceMember > 0 && (
                  <i>
                    Totalt:{' '}
                    <strong>
                      {event.addFee
                        ? addStripeFee(Number(event.priceMember))
                        : event.priceMember}
                      ,-
                    </strong>
                  </i>
                )}
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
              event.eventStatusType && event.eventStatusType.value
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
              event.eventStatusType && event.eventStatusType.value
            ) &&
              event.heedPenalties && (
                <div className={styles.subSection}>
                  <Tooltip content="Frist for avmelding – fører til prikk etterpå">
                    <Field
                      key="unregistrationDeadline"
                      label="Avregistreringsfrist"
                      name="unregistrationDeadline"
                      component={DatePicker.Field}
                      fieldClassName={styles.metaField}
                      className={styles.formField}
                    />
                  </Tooltip>
                </div>
              )}
            {['NORMAL', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
            ) && (
              <Tooltip content="Separate frister for påmelding og avmelding - antall timer før arrangementet. Det vil ikke være mulig å melde seg av eller på etter de satte fristene (negativ verdi betyr antall timer etter starten på arrangementet)">
                <Field
                  label="Separat avregistregistreringsfrist"
                  name="separateDeadlines"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={(v) => !!v}
                />
              </Tooltip>
            )}
            {['NORMAL', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
            ) &&
              event.separateDeadlines && (
                <div className={styles.subSection}>
                  <Tooltip content="Frist for avmelding antall timer før arrangementet (negativ verdi betyr antall timer etter starten på arrangementet)">
                    <Field
                      key="unregistrationDeadlineHours"
                      label="Avregistrering antall timer før"
                      name="unregistrationDeadlineHours"
                      type="number"
                      component={TextInput.Field}
                      fieldClassName={styles.metaField}
                      className={styles.formField}
                    />
                  </Tooltip>
                </div>
              )}
            {['NORMAL', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
            ) && (
              <Tooltip content="Frist for påmelding/avmelding - antall timer før arrangementet. Det er ikke mulig å melde seg hverken på eller av etter denne fristen (negativ verdi betyr antall timer etter starten på arrangementet)">
                <Field
                  key="registrationDeadlineHours"
                  label="Registrering antall timer før"
                  name="registrationDeadlineHours"
                  type="number"
                  component={TextInput.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                />
                <p className={styles.registrationDeadlineHours}>
                  Stenger:{' '}
                  <FormatTime time={moment(event.registrationDeadline)} />
                </p>
              </Tooltip>
            )}
            {['NORMAL', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
            ) && (
              <Tooltip content="Bruk samtykke til bilder">
                <Field
                  label="Samtykke til bilder"
                  name="useConsent"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={(v) => !!v}
                />
              </Tooltip>
            )}
            {['NORMAL', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
            ) && (
              <Tooltip content="Navn, telefonnummer og epost kan deles med folk utenfor Abakus til smittesporing. Dersom informasjonen skal kunne deles med andre enn FHI og NTNU, må dette spesifiseres i beskrivelsen.">
                <Field
                  label="Informasjon kan deles til smittesporing"
                  name="useContactTracing"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={(v) => !!v}
                  disabled={moment().isAfter(event.activationTime)}
                />
              </Tooltip>
            )}
            {['NORMAL', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
            ) && (
              <Tooltip content="Still et spørsmål ved påmelding">
                <Field
                  label="Påmeldingsspørsmål"
                  name="hasFeedbackQuestion"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={(v) => !!v}
                />
              </Tooltip>
            )}
            {['NORMAL', 'INFINITE'].includes(
              event.eventStatusType && event.eventStatusType.value
            ) &&
              event.hasFeedbackQuestion && (
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
              event.eventStatusType && event.eventStatusType.value
            ) && (
              <Flex column>
                <h3>Pools</h3>
                <ModalParentComponent
                  key="modal"
                  pools={pools || []}
                  title="Påmeldte"
                >
                  <AttendanceStatus pools={pools} />
                </ModalParentComponent>
                <div className={styles.metaList}>
                  <FieldArray
                    name="pools"
                    component={renderPools}
                    startTime={event.startTime}
                    eventStatusType={event.eventStatusType?.value}
                  />
                </div>
                {pools && pools.length > 1 && (
                  <Tooltip content="Tidspunkt for å slå sammen poolene">
                    <Field
                      label="Sammenslåingstidspunkt"
                      name="mergeTime"
                      component={DatePicker.Field}
                      fieldClassName={styles.metaField}
                      className={styles.formField}
                    />
                  </Tooltip>
                )}
                {isEditPage && (
                  <Admin
                    actionGrant={actionGrant}
                    event={event}
                    deleteEvent={deleteEvent}
                  />
                )}
              </Flex>
            )}
          </ContentSidebar>
        </ContentSection>

        <Flex wrap>
          {isEditPage && (
            <Button onClick={() => push(`/events/${event.id}`)}>Avbryt</Button>
          )}
          <Button success={isEditPage} disabled={pristine || submitting} submit>
            {isEditPage ? 'Lagre endringer' : 'Opprett'}
          </Button>
        </Flex>
      </Form>
    </Content>
  );
}

const isInteger = (value) => /^-?\d+$/.test(value);

type ValidationError<T> = Partial<{
  [key in keyof T]: string | Record<string, string>[];
}>;

const validate = (data) => {
  const errors: ValidationError<EditingEvent> = {};
  const [isValidYoutubeUrl, errorMessage = ''] = validYoutubeUrl()(
    data.youtubeUrl
  );

  if (!isValidYoutubeUrl) {
    errors.youtubeUrl = errorMessage;
  }

  if (!data.title) {
    errors.title = 'Tittel er påkrevet';
  }

  if (!data.description || data.description.trim() === '') {
    errors.description = 'Kalenderbeskrivelse er påkrevet';
  }

  if (!data.eventType) {
    errors.eventType = 'Arrangementstype er påkrevet';
  }

  if (data.isPriced && data.priceMember > 10000) {
    errors.priceMember = 'Prisen er for høy';
  }

  if (data.isPriced && Number(data.priceMember) <= 0) {
    errors.priceMember = 'Prisen må være større enn 0';
  }

  if (!data.location) {
    errors.location = 'Lokasjon er påkrevet';
  }

  if (data.useMazemap && !data.mazemapPoi) {
    errors.mazemapPoi = 'Sted eller Mazemap-rom er påkrevd.';
  }

  if (data.hasFeedbackQuestion && !data.feedbackDescription) {
    errors.feedbackDescription = 'Spørsmål er tomt.';
  }

  if (!data.id && !data.cover) {
    errors.cover = 'Cover er påkrevet';
  }

  if (!data.eventStatusType) {
    errors.eventStatusType = 'Påmeldingstype er påkrevd';
  }

  if (data.pools) {
    errors.pools = validatePools(data.pools);
  }

  if (data.feedbackRequired && !data.feedbackDescription) {
    errors.feedbackDescription = 'Kan ikke være tomt';
  }

  if (!isInteger(data.registrationDeadlineHours)) {
    errors.registrationDeadlineHours = 'Kun hele timer';
  }

  if (!isInteger(data.unregistrationDeadlineHours)) {
    errors.unregistrationDeadlineHours = 'Kun hele timer';
  }

  if (moment(data.startTime).isSameOrAfter(data.endTime)) {
    errors.endTime = 'Starttidspunkt må være før sluttidspunkt';
  }

  if (
    moment(data.unregistrationDeadline)
      .add(1, 'days')
      .isAfter(moment(data.paymentDueDate))
  ) {
    errors.paymentDueDate =
      'Betalingsfristen må være minst 24 timer etter avregistreringsfristen';
  }

  const mergeTimeError =
    data.pools &&
    data.pools
      .map((pool) => pool.activationDate)
      .some(
        (activation) =>
          data.mergeTime && moment(activation).isAfter(data.mergeTime)
      );

  if (mergeTimeError) {
    errors.mergeTime = 'Sammenslåingstidspunkt satt før aktiveringspunkt';
  }

  return errors;
};

export default legoForm({
  form: 'eventEditor',
  validate,
  onSubmit: (values, dispatch, props: Props) => {
    props.handleSubmitCallback(values);
    if (values.saveToImageGallery) {
      props.setSaveForUse(values.cover, true);
    }
  },
})(EventEditor);
