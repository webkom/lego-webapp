// @flow

import styles from './EventEditor.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Image from 'app/components/Image';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';
import Icon from 'app/components/Icon';
import Markdown from 'app/components/Markdown';
import JoinEventForm from '../JoinEventForm';
import RegisteredCell from '../RegisteredCell';
import RegisteredSummary from '../RegisteredSummary';
import colorForEvent from '../../colorForEvent';
import { AttendanceStatus } from 'app/components/UserAttendance';
import Tag from 'app/components/Tag';
import Time from 'app/components/Time';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field } from 'redux-form';
import {
  Form,
  EditorField,
  SelectInput,
  TextInput,
  TextEditor,
  Button,
  DatePicker
} from 'app/components/Form';
import { eventTypes } from '../../utils.js';

const InterestedButton = ({ value, onClick }) => {
  const [icon, text] = value
    ? ['check', 'Du er interessert']
    : ['plus', 'Jeg er interessert'];

  return (
    <Button onClick={onClick}>
      <Icon name={icon} />
      {' '}
      {text}
    </Button>
  );
};

/**
 *
 */
type Props = {
  eventId: Number,
  event: Object,
  loggedIn: boolean,
  currentUser: Object,
  actionGrant: Array<any>,
  comments: Array<any>,
  error?: Object,
  loading: boolean,
  pools: Array<any>,
  registrations: Array<any>,
  poolsWithWaitingRegistrations: Array<any>,
  waitingRegistrations: Array<any>,
  isUserInterested: boolean,
  register: (eventId: Number) => Promise<*>,
  unregister: (eventId: Number, registrationId: Number) => Promise<*>,
  payment: (eventId: Number, token: string) => Promise<*>,
  updateFeedback: (
    eventId: Number,
    registrationId: Number,
    feedback: string
  ) => Promise<*>,
  handleSubmit: void,
  handleSubmitCallback: void,
  onQueryChanged: (query: string) => void,
  searching: boolean
};

/**
 *
 */
function EventEditor(
  {
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
    searching
  }: Props
) {
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
  console.log('asd', styles.company);

  return (
    <div className={styles.root}>
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
        <FlexRow>
          <FlexColumn className={styles.description}>
            <Markdown>{event.text}</Markdown>
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
              <li style={{ display: 'flex' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Hva{' '}
                </span>
                <Field
                  name="eventType"
                  fieldStyle={{
                    margin: 0,
                    marginLeft: 5,
                    boxShadow: '0 0 10px #394B59'
                  }}
                  component={SelectInput.Field}
                  options={Object.keys(eventTypes).map(type => ({
                    label: eventTypes[type],
                    value: type
                  }))}
                  placeholder="Bedrift"
                />
              </li>
              <li style={{ display: 'flex' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Arrangerende bedrift
                </span>
                <Field
                  name="company"
                  fieldStyle={{
                    flex: 1,
                    margin: 0,
                    marginLeft: 5,
                    boxShadow: '0 0 10px #394B59'
                  }}
                  component={SelectInput.Field}
                  options={companyResult}
                  onSearch={query => onQueryChanged(query)}
                  placeholder="Bedrift"
                  fetching={searching}
                />
              </li>
              <li style={{ display: 'flex' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Starter{' '}
                </span>
                <Field
                  name="startTime"
                  fieldClassName={styles.metaField}
                  className={styles.company}
                  component={DatePicker.Field}
                />
              </li>
              <li style={{ display: 'flex' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Slutter{' '}
                </span>
                <Field
                  name="endTime"
                  fieldClassName={styles.metaField}
                  className={styles.company}
                  component={DatePicker.Field}
                />
              </li>
              <li style={{ display: 'flex' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Merge time{' '}
                </span>
                <Field
                  name="mergeTime"
                  fieldClassName={styles.metaField}
                  className={styles.company}
                  component={DatePicker.Field}
                />
              </li>
              <li style={{ display: 'flex' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Finner sted i{' '}
                </span>
                <Field
                  name="location"
                  fieldClassName={styles.metaField}
                  className={styles.company}
                  component={TextInput.Field}
                />
              </li>
              {event.activationTime &&
                <li>
                  Påmelding åpner
                  {' '}
                  <strong>
                    <Time
                      time={event.activationTime}
                      format="DD.MM.YYYY HH:mm"
                    />
                  </strong>
                </li>}
              {event.isPriced && <li>Dette er et betalt arrangement</li>}
              {event.price > 0 &&
                <li>Pris: <strong>{event.price / 100},-</strong></li>}
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
              </FlexItem>}
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn className={styles.join}>
            <Button submit>LAGRE</Button>
          </FlexColumn>

          <FlexColumn className={styles.openFor}>
            <strong>Åpent for</strong>
            <ul>
              {(pools || [])
                .map(pool =>
                  pool.permissionGroups.map(group => (
                    <li key={group.id}>{group.name}</li>
                  )))}
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
  validate(values) {
    const errors = {};
    return errors;
  }
})(EventEditor);
