// @flow

import styles from './EventEditor.css';
import React from 'react';
import { Link } from 'react-router';
import Image from 'app/components/Image';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';
import RegisteredCell from '../RegisteredCell';
import RegisteredSummary from '../RegisteredSummary';
import { AttendanceStatus } from 'app/components/UserAttendance';
import Tag from 'app/components/Tag';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field } from 'redux-form';
import {
  Form,
  EditorField,
  SelectInput,
  TextInput,
  CheckBox,
  Button,
  DatePicker
} from 'app/components/Form';
import { eventTypes, colorForEvent } from '../../utils.js';
import Admin from '../Admin';
import Tooltip from 'app/components/Tooltip';

/**
 *
 */
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
  poolsWithWaitingRegistrations: Array<Object>,
  waitingRegistrations: Array<Object>,
  change: void,
  isUserInterested: boolean,
  handleSubmit: void => void,
  handleSubmitCallback: void,
  companyResult: Object,
  onQueryChanged: (query: string) => void,
  searching: boolean,
  deleteEvent: (eventId: string) => Promise<*>
};

/**
 *
 */
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
  poolsWithWaitingRegistrations,
  waitingRegistrations,
  change,
  handleSubmit,
  handleSubmitCallback,
  companyResult,
  onQueryChanged,
  searching,
  deleteEvent
}: Props) {
  const isEditPage = eventId !== undefined;
  if (!actionGrant.includes('update')) {
    return null;
  }

  if (isEditPage && Object.keys(event).length === 0) {
    return <LoadingIndicator loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  const metaColor = colorForEvent(event.eventType);

  return (
    <div className={styles.root}>
      <h2>
        <Link to={`/events/${eventId}`}>
          <i className="fa fa-angle-left" />
          {` ${event.title}`}
        </Link>
      </h2>
      <div className={styles.coverImage}>
        <Image src={event.cover} />
      </div>
      <Form onSubmit={handleSubmit(handleSubmitCallback)}>
        <FlexRow alignItems="center" justifyContent="space-between">
          <Field
            name="title"
            className={styles.title}
            component={TextInput.Field}
          />
        </FlexRow>
        <Field
          name="description"
          className={styles.description}
          component={TextInput.Field}
        />
        <FlexRow className={styles.mainRow}>
          <FlexColumn className={styles.description}>
            <Field
              name="text"
              component={EditorField}
              placeholder="Write your event here..."
            />
            <FlexRow className={styles.tagRow}>
              {event.tags.map((tag, i) => <Tag key={i} tag={tag} />)}
            </FlexRow>
          </FlexColumn>
          <FlexColumn className={styles.meta} style={{ background: metaColor }}>
            <ul>
              <li className={styles.metaList}>
                <span>Hva</span>
                <Field
                  name="eventType"
                  fieldClassName={styles.metaField}
                  fieldStyle={{
                    boxShadow: '0 0 10px #394B59'
                  }}
                  simpleValue
                  component={SelectInput.Field}
                  options={Object.keys(eventTypes).map(type => ({
                    label: eventTypes[type],
                    value: type
                  }))}
                  placeholder="Arrangementstype"
                />
              </li>
              <li className={styles.metaList}>
                <span>Arrangerende bedrift</span>
                <Field
                  name="company"
                  fieldClassName={styles.metaField}
                  fieldStyle={{
                    boxShadow: '0 0 10px #394B59'
                  }}
                  component={SelectInput.Field}
                  options={companyResult}
                  onSearch={query => onQueryChanged(query)}
                  placeholder="Bedrift"
                  fetching={searching}
                />
              </li>
              <li className={styles.metaList}>
                <span>Starter</span>
                <Field
                  name="startTime"
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  component={DatePicker.Field}
                />
              </li>
              <li className={styles.metaList}>
                <span>Slutter</span>
                <Field
                  name="endTime"
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  component={DatePicker.Field}
                />
              </li>
              <li className={styles.metaList}>
                <span>Finner sted i</span>
                <Field
                  name="location"
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  component={TextInput.Field}
                />
              </li>
              <li className={styles.metaList}>
                <span>Betalt arrangement</span>
                <Field
                  name="isPriced"
                  fieldClassName={styles.metaField}
                  className={styles.formField}
                  component={CheckBox.Field}
                />
              </li>
              {event.isPriced &&
                <div>
                  <li className={styles.metaList}>
                    <span>
                      <Tooltip content="Manuell betaling kan også hukes av i etterkant">
                        Betaling igjennom Abakus.no
                      </Tooltip>
                    </span>
                    <Field
                      name="useStripe"
                      fieldClassName={styles.metaField}
                      className={styles.formField}
                      component={CheckBox.Field}
                    />
                  </li>
                  <li className={styles.metaList}>
                    <span>Pris medlem</span>
                    <Field
                      name="priceMember"
                      type="number"
                      fieldClassName={styles.metaField}
                      className={styles.formField}
                      component={TextInput.Field}
                    />
                  </li>
                </div>}
            </ul>
            {loggedIn &&
              <FlexItem>
                <h3>Påmeldte:</h3>
                <FlexRow className={styles.registeredThumbnails}>
                  {registrations
                    .slice(0, 10)
                    .map(reg => (
                      <RegisteredCell key={reg.user.id} user={reg.user} />
                    ))}
                </FlexRow>
                <RegisteredSummary registrations={registrations} />
                <AttendanceStatus
                  title="Påmeldte"
                  pools={poolsWithWaitingRegistrations}
                />
                <div className={styles.metaList}>
                  <span>Merge time</span>
                  <Field
                    name="mergeTime"
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    component={DatePicker.Field}
                  />
                </div>
                <div className={styles.metaList}>
                  <span>Bruk Captcha ved påmelding</span>
                  <Field
                    name="useCaptcha"
                    fieldClassName={styles.metaField}
                    className={styles.formField}
                    component={CheckBox.Field}
                  />
                </div>
                <Admin
                  actionGrant={actionGrant}
                  event={event}
                  deleteEvent={deleteEvent}
                />
              </FlexItem>}
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn className={styles.join}>
            <Button submit>LAGRE</Button>

            <Link to={`/events/${event.id}`}>
              <Button>TILBAKE</Button>
            </Link>
          </FlexColumn>

          <FlexColumn className={styles.openFor}>
            <strong>Åpent for</strong>
            <ul>
              {(pools || [])
                .map(pool =>
                  pool.permissionGroups.map(group => (
                    <li key={group.id}>{group.name}</li>
                  ))
                )}
            </ul>
          </FlexColumn>

        </FlexRow>
      </Form>
    </div>
  );
}

export default reduxForm({
  form: 'eventEditor',
  enableReinitialize: true,
  validate(data) {
    const errors = {};
    if (!data.eventType) {
      errors.eventType = 'Arrangementstype er påkrevet';
    }
    return errors;
  }
})(EventEditor);
