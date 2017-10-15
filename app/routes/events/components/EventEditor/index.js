// @flow

import styles from './EventEditor.css';
import React from 'react';
import { Link } from 'react-router';
import renderPools, { validatePools } from './renderPools';
import RegisteredCell from '../RegisteredCell';
import RegisteredSummary from '../RegisteredSummary';
import { AttendanceStatus } from 'app/components/UserAttendance';
import Tag from 'app/components/Tag';
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
import Tooltip from 'app/components/Tooltip';
import cx from 'classnames';

type Props = {
  eventId: string,
  event: Object,
  loggedIn: boolean,
  currentUser: Object,
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
  setCoverPhoto: (number, String) => void,
  deleteEvent: (eventId: string) => Promise<*>,
  submitting: boolean,
  pristine: boolean
};

function EventEditor({
  event,
  eventId,
  loggedIn,
  currentUser,
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
    <div className={styles.root}>
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
          component={ImageUploadField.Field}
          uploadFile={uploadFile}
          edit={isEditPage && (token => setCoverPhoto(eventId, token))}
          aspectRatio={20 / 6}
          img={event.cover}
        />
        <Flex wrap alignItems="center" justifyContent="space-between">
          <Field
            name="title"
            placeholder="Tittel"
            className={styles.title}
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
              placeholder="Write your event here..."
              className={styles.descriptionEditor}
              uploadFile={uploadFile}
            />
            <Flex className={styles.tagRow}>
              {(event.tags || []).map((tag, i) => <Tag key={i} tag={tag} />)}
            </Flex>
          </Flex>
          <Flex column className={cx(styles.meta, styleType)}>
            <Field
              name="eventType"
              label="Hva"
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
              label="Finner sted i"
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
              </div>
            )}
            {loggedIn && (
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
                <RegisteredSummary registrations={[]} />
                <AttendanceStatus title="Påmeldte" pools={pools} />
                <div className={styles.metaList}>
                  <FieldArray name="pools" component={renderPools} />
                </div>
                {pools &&
                  pools.length > 1 && (
                    <Tooltip content="Tidspunkt for å slå sammen poolene">
                      <Field
                        label="Merge time"
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
          </Flex>
        </Flex>

        <Flex wrapReverse>
          <Flex column className={styles.join}>
            <Field
              name="useCaptcha"
              label="Bruk Captcha ved påmelding"
              fieldClassName={styles.metaField}
              className={styles.formField}
              component={CheckBox.Field}
              normalize={v => !!v}
            />
            <Field
              name="feedbackRequired"
              label="Tvungen tilbakemelding"
              fieldClassName={styles.metaField}
              className={styles.formField}
              component={CheckBox.Field}
              normalize={v => !!v}
            />
            <Button disabled={pristine || submitting} submit>
              LAGRE
            </Button>

            {isEditPage && (
              <Link to={`/events/${event.id}`}>
                <Button>TILBAKE</Button>
              </Link>
            )}
          </Flex>

          <Flex column className={styles.openFor}>
            <strong>Åpent for</strong>
            <ul>
              {(pools || []).map(pool =>
                (pool.permissionGroups || []).map(group => (
                  <li key={group.value}>{group.label}</li>
                ))
              )}
            </ul>
          </Flex>
        </Flex>
      </Form>
    </div>
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
    errors.pools = validatePools(data.pools);
    return errors;
  }
})(EventEditor);
