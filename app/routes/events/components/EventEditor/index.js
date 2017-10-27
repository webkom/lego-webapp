// @flow

import styles from './EventEditor.css';
import React from 'react';
import { Link } from 'react-router';
import renderPools, { validatePools } from './renderPools';
import RegisteredCell from '../RegisteredCell';
import RegisteredSummary from '../RegisteredSummary';
import { AttendanceStatus } from 'app/components/UserAttendance';
import Tag from 'app/components/Tags/Tag';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field, FieldArray } from 'redux-form';
import {
  Form,
  EditorField,
  SelectInput,
  TextInput,
  TextEditor,
  CheckBox,
  Button,
  DatePicker,
  ImageUploadField
} from 'app/components/Form';
import { Flex } from 'app/components/Layout';
import { eventTypes, styleForEvent } from '../../utils.js';
import Admin from '../Admin';
import Content from 'app/components/Layout/Content';
import Tooltip from 'app/components/Tooltip';
import cx from 'classnames';
import type { ID } from 'app/models';

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
  handleSubmitCallback: void,
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
  handleSubmitCallback,
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
  const styleType = styleForEvent(event.eventType);

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
      <Form onSubmit={handleSubmit(handleSubmitCallback)}>
        <Field
          name="cover"
          component={ImageUploadField}
          uploadFile={uploadFile}
          edit={isEditPage && (token => setCoverPhoto(eventId, token))}
          aspectRatio={20 / 6}
          img={event.cover}
        />
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
            className={cx(styleType, styles.title)}
            component={TextInput.Field}
          />
        </Flex>
        <Field
          name="description"
          placeholder="Kalenderbeskrivelse"
          className={styles.description}
          component={TextEditor.Field}
        />
        <Flex wrap className={styles.mainRow}>
          <Flex column className={styles.description}>
            <Field
              name="text"
              component={EditorField}
              placeholder="Dette blir tidenes fest..."
              className={styles.descriptionEditor}
              uploadFile={uploadFile}
            />
            <Flex className={styles.tagRow}>
              {(event.tags || []).map((tag, i) => <Tag key={i} tag={tag} />)}
            </Flex>
          </Flex>
          <Flex column className={styles.meta}>
            <Field
              name="eventType"
              label="Type arrangement"
              simpleValue
              fieldClassName={styles.metaField}
              component={SelectInput.Field}
              options={Object.keys(eventTypes).map(type => ({
                label: eventTypes[type],
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
              label="Sted"
              name="location"
              component={TextInput.Field}
              fieldClassName={styles.metaField}
              className={styles.formField}
            />
            <Field
              label="Betalt arrangement"
              name="isPriced"
              component={CheckBox.Field}
              fieldClassName={styles.metaField}
              className={styles.formField}
              normalize={v => !!v}
            />
            {event.isPriced && (
              <div>
                <Tooltip content="Manuell betaling kan også av i etterkant">
                  <Field
                    label="Betaling igjennom Abakus.no"
                    name="useStripe"
                    component={CheckBox.Field}
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    normalize={v => !!v}
                  />
                </Tooltip>
                <Field
                  label="Pris medlem"
                  name="priceMember"
                  type="number"
                  component={TextInput.Field}
                  fieldClassName={styles.metaField}
                  className={styles.formField}
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
            <Flex column>
              <h3>Påmeldte:</h3>
              <Flex className={styles.registeredThumbnails}>
                {registrations &&
                  registrations
                    .slice(0, 10)
                    .map(reg => (
                      <RegisteredCell key={reg.user.id} user={reg.user} />
                    ))}
              </Flex>
              <RegisteredSummary registrations={[]} toggleModal={i => {}} />
              <AttendanceStatus title="Påmeldte" pools={pools} />
              <div className={styles.metaList}>
                <FieldArray name="pools" component={renderPools} />
              </div>
              {pools &&
                pools.length > 1 && (
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
          </Flex>
        </Flex>

        <Flex wrapReverse>
          <Flex column className={styles.join}>
            <Flex column>
              <Field
                label="Tilbakemeldingsbeskrivelse"
                name="feedbackDescription"
                placeholder="E.g. Melding til arrangører"
                component={TextInput.Field}
              />
              <Field
                name="feedbackRequired"
                label="Tvungen tilbakemelding"
                component={CheckBox.Field}
                normalize={v => !!v}
              />
              <Field
                name="useCaptcha"
                label="Bruk Captcha ved påmelding"
                component={CheckBox.Field}
                normalize={v => !!v}
              />
              <div>
                <Button disabled={pristine || submitting} submit>
                  LAGRE
                </Button>
              </div>
              {isEditPage && (
                <Link to={`/events/${event.id}`}>
                  <Button>TILBAKE</Button>
                </Link>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Form>
    </Content>
  );
}

export default reduxForm({
  form: 'eventEditor',
  enableReinitialize: true,
  validate(data) {
    const errors = {};
    if (!data.title) {
      errors.title = 'Tittel er påkrevet';
    }
    if (!data.description || data.description.trim() === '') {
      errors.description = 'Kalenderbeskrivelse er påkrevet';
    }
    if (!data.eventType) {
      errors.eventType = 'Arrangementstype er påkrevet';
    }
    if (data.priceMember > 10000) {
      errors.priceMember = 'Prisen er for høy';
    }
    if (Number(data.priceMember) <= 0) {
      errors.priceMember = 'Prisen må være større enn 0';
    }
    if (!data.location) {
      errors.location = 'Lokasjon er påkrevet';
    }
    if (!data.id && !data.cover) {
      errors.cover = 'Cover er påkrevet';
    }
    errors.pools = validatePools(data.pools);
    return errors;
  }
})(EventEditor);
