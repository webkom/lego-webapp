// @flow

import styles from './EventEditor.css';
import React from 'react';
import { Link } from 'react-router-dom';
import renderPools, { validatePools } from './renderPools';
import {
  AttendanceStatus,
  ModalParentComponent
} from 'app/components/UserAttendance';
import Tag from 'app/components/Tags/Tag';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Field, FieldArray } from 'redux-form';
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
  legoForm
} from 'app/components/Form';
import { Flex } from 'app/components/Layout';
import { addStripeFee, EVENT_CONSTANTS, colorForEvent } from '../../utils';
import Admin from '../Admin';
import {
  Content,
  ContentSection,
  ContentMain,
  ContentSidebar
} from 'app/components/Content';
import Tooltip from 'app/components/Tooltip';
import Icon from 'app/components/Icon';
import type { ID } from 'app/models';
import { validYoutubeUrl } from 'app/utils/validation';
import { FormatTime } from 'app/components/Time';
import moment from 'moment-timezone';

type Props = {
  eventId: number,
  event: Object,
  actionGrant: Array<string>,
  error?: Object,
  loading: boolean,
  pools: Array<Object>,
  registrations: Array<Object>,
  waitingRegistrations: Array<Object>,
  change: void,
  isUserInterested: boolean,
  handleSubmit: void => void,
  handleSubmitCallback: any => Promise<*>,
  uploadFile: () => Promise<*>,
  setCoverPhoto: (number, string) => void,
  deleteEvent: (eventId: ID) => Promise<*>,
  submitting: boolean,
  pristine: boolean
};

function EventEditor({
  event,
  eventId,
  actionGrant,
  error,
  loading,
  pools,
  registrations,
  waitingRegistrations,
  change,
  handleSubmit,
  uploadFile,
  setCoverPhoto,
  deleteEvent,
  submitting,
  pristine
}: Props) {
  const isEditPage = eventId !== undefined;
  if (isEditPage && !actionGrant.includes('edit')) {
    return null;
  }

  if (isEditPage && Object.keys(event).length === 0) {
    return <LoadingIndicator loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const isTBA = value =>
    value && value == 'TBA' ? `Velg påmeldingstype TBA` : undefined;

  const tooLow = value =>
    value && value <= 3 ? `Summen må være strørre enn 3 kr` : undefined;

  const eventStatusType = [
    { value: 'TBA', label: 'Ikke bestemt (TBA)' },
    { value: 'NORMAL', label: 'Vanlig påmelding (med pools)' },
    { value: 'OPEN', label: 'Åpen (uten påmelding)' },
    { value: 'INFINITE', label: 'Åpen (med påmelding)' }
  ];

  const color = colorForEvent(event.eventType);
  return (
    <Content>
      {isEditPage && (
        <h2>
          <Link to={`/events/${eventId}`}>
            <i className="fa fa-angle-left" />
            {` ${event.title}`}
          </Link>
        </h2>
      )}
      <Form onSubmit={handleSubmit}>
        <Field
          name="cover"
          component={ImageUploadField}
          uploadFile={uploadFile}
          edit={isEditPage && (token => setCoverPhoto(eventId, token))}
          aspectRatio={20 / 6}
          img={event.cover}
        />
        <Flex>
          <Field
            name="youtubeUrl"
            label={
              <Flex>
                <div>Erstatt cover-bildet med video fra YouTube</div>
                <div style={{ marginLeft: '5px' }}>
                  <Tooltip
                    style={{ marginLeft: '3px' }}
                    content="Valgfritt felt. Videoen erstatter ikke coveret i listen over arrangementer."
                  >
                    <Icon
                      name="information-circle-outline"
                      size={20}
                      style={{ cursor: 'pointer' }}
                    />
                  </Tooltip>
                </div>
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
          normalize={v => !!v}
        />
        <Flex wrap alignItems="center" justifyContent="space-between">
          <Field
            name="title"
            placeholder="Tittel"
            style={{ borderBottom: `2px solid ${color}` }}
            className={styles.title}
            component={TextInput.Field}
          />
        </Flex>
        <Field
          name="description"
          label="Kalenderbeskrivelse"
          placeholder="Kom på fest den..."
          className={styles.description}
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
              simpleValue
              fieldClassName={styles.metaField}
              component={SelectInput.Field}
              options={Object.keys(EVENT_CONSTANTS).map(type => ({
                label: EVENT_CONSTANTS[type],
                value: type
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
            <Tooltip content="Kun la medlemmer i Abakom se arrangement">
              <Field
                label="Kun for Abakom"
                name="isAbakomOnly"
                component={CheckBox.Field}
                fieldClassName={styles.metaField}
                className={styles.formField}
                normalize={v => !!v}
              />
            </Tooltip>
            <Field
              label="Påmeldingstype"
              name="eventStatusType"
              component={SelectInput.Field}
              fieldClassName={styles.metaField}
              options={eventStatusType}
              simpleValue
            />
            {['NORMAL', 'OPEN', 'INFINITE'].includes(event.eventStatusType) && (
              <Field
                label="Sted"
                name="location"
                placeholder="Den gode nabo, R5, ..."
                component={TextInput.Field}
                fieldClassName={styles.metaField}
                className={styles.formField}
                warn={isTBA}
              />
            )}
            {['NORMAL', 'INFINITE'].includes(event.eventStatusType) && (
              <Field
                label="Betalt arrangement"
                name="isPriced"
                component={CheckBox.Field}
                fieldClassName={styles.metaField}
                className={styles.formField}
                normalize={v => !!v}
              />
            )}
            {event.isPriced && (
              <div className={styles.subSection}>
                <Tooltip content="Manuell betaling kan også av i etterkant">
                  <Field
                    label="Betaling via Abakus.no"
                    name="useStripe"
                    component={CheckBox.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    normalize={v => !!v}
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
                        normalize={v => !!v}
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
            {['NORMAL', 'INFINITE'].includes(event.eventStatusType) && (
              <Field
                label="Bruk prikker"
                name="heedPenalties"
                component={CheckBox.Field}
                fieldClassName={styles.metaField}
                className={styles.formField}
                normalize={v => !!v}
              />
            )}
            {['NORMAL', 'INFINITE'].includes(event.eventStatusType) &&
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
            {['NORMAL', 'INFINITE'].includes(event.eventStatusType) && (
              <Tooltip content="Frist for påmelding/avmelding - antall timer før arrangementet. Det er ikke mulig å melde seg hverken på eller av etter denne fristen">
                <Field
                  key="registrationDeadlineHours"
                  label="Antall timer før"
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
            {['NORMAL', 'INFINITE'].includes(event.eventStatusType) && (
              <Tooltip content="Bruk samtykke til bilder">
                <Field
                  label="Samtykke til bilder"
                  name="useConsent"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={v => !!v}
                />
              </Tooltip>
            )}
            {['NORMAL', 'INFINITE'].includes(event.eventStatusType) && (
              <Tooltip content="Et spørsmål alle må svare på før de melder seg på">
                <Field
                  name="feedbackRequired"
                  label="Obligatorisk spørsmål"
                  component={CheckBox.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  normalize={v => !!v}
                />
              </Tooltip>
            )}
            {['NORMAL', 'INFINITE', 'OPEN'].includes(event.eventStatusType) &&
              event.feedbackRequired && (
                <div className={styles.subSection}>
                  <Field
                    name="feedbackDescription"
                    placeholder="Burger eller sushi?"
                    component={TextInput.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                  />
                </div>
              )}
            {['NORMAL', 'INFINITE'].includes(event.eventStatusType) && (
              <Flex column>
                <h3>Pools</h3>
                <ModalParentComponent
                  key="modal"
                  pools={pools || []}
                  registrations={registrations || []}
                  title="Påmeldte"
                >
                  <AttendanceStatus />
                </ModalParentComponent>
                <div className={styles.metaList}>
                  <FieldArray
                    name="pools"
                    component={renderPools}
                    startTime={event.startTime}
                    eventStatusType={event.eventStatusType}
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

        <div>
          {isEditPage && (
            <Link to={`/events/${event.id}`}>
              <Button style={{ marginRight: '20px' }}>TILBAKE</Button>
            </Link>
          )}
          <Button disabled={pristine || submitting} submit>
            {isEditPage ? 'LAGRE ENDRINGER' : 'OPPRETT'}
          </Button>
        </div>
      </Form>
    </Content>
  );
}

const validate = data => {
  const errors = {};
  const isPositiveNumeric = value => /^\d+$/.test(value);
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
  if (!isPositiveNumeric(data.registrationDeadlineHours)) {
    errors.registrationDeadlineHours = 'Kun hele timer';
  }
  if (!moment(data.startTime).isBefore(data.endTime)) {
    errors.endTime = 'Starttidspunkt må være før sluttidspunkt';
  }
  return errors;
};

export default legoForm({
  form: 'eventEditor',
  validate,
  onSubmit: (values, dispatch, props: Props) =>
    props.handleSubmitCallback(values)
})(EventEditor);
