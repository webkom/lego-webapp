// @flow

import styles from './EventEditor.css';
import React from 'react';
import { Link } from 'react-router';
import Image from 'app/components/Image';
import renderPools from './renderPools';
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
  DatePicker
} from 'app/components/Form';
import { Flex } from 'app/components/Layout';
import { eventTypes, colorForEvent } from '../../utils.js';
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
  autocompleteResult: Object,
  companyQueryChanged: (query: string) => void,
  groupQueryChanged: (query: string) => void,
  searching: boolean,
  deleteEvent: (eventId: string) => Promise<*>,
  submitting: boolean,
  pristine: boolean
};

type fieldProps = {
  text: any,
  name: string,
  component: any
};

const FieldElement = ({ text, name, component, ...props }: fieldProps) => {
  return (
    <div className={styles.metaList}>
      <span>{text}</span>
      <Field
        {...props}
        name={name}
        fieldClassName={styles.metaField}
        className={styles.formField}
        component={component}
      />
    </div>
  );
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
  autocompleteResult,
  companyQueryChanged,
  groupQueryChanged,
  searching,
  deleteEvent,
  submitting,
  pristine
}: Props) {
  const isEditPage = eventId !== undefined;
  if (isEditPage && !actionGrant.includes('update')) {
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
      {isEditPage &&
        <h2>
          <Link to={`/events/${eventId}`}>
            <i className="fa fa-angle-left" />
            {` ${event.title}`}
          </Link>
        </h2>}
      <div className={styles.coverImage}>
        <Image src={event.cover} />
      </div>
      <Form onSubmit={handleSubmit(handleSubmitCallback)}>
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
          placeholder="Beskrivelse"
          className={styles.description}
          component={TextEditor.Field}
        />
        <Flex wrap className={styles.mainRow}>
          <Flex column className={styles.description}>
            <Field
              name="text"
              component={EditorField}
              placeholder="Write your event here..."
            />
            <Flex className={styles.tagRow}>
              {(event.tags || []).map((tag, i) => <Tag key={i} tag={tag} />)}
            </Flex>
          </Flex>
          <Flex
            column
            className={styles.meta}
            style={{ background: metaColor }}
          >
            <ul>
              <li className={styles.metaList}>
                <span>Hva</span>
                <Field
                  name="eventType"
                  fieldClassName={cx(styles.metaField, styles.fieldShadow)}
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
                  fieldClassName={cx(styles.metaField, styles.fieldShadow)}
                  component={SelectInput.Field}
                  options={autocompleteResult}
                  onSearch={query => companyQueryChanged(query)}
                  placeholder="Bedrift"
                  fetching={searching}
                />
              </li>
              <FieldElement
                text="Starter"
                name="startTime"
                component={DatePicker.Field}
              />
              <FieldElement
                text="Slutter"
                name="endTime"
                component={DatePicker.Field}
              />
              <FieldElement
                text="Finner sted i"
                name="location"
                component={TextInput.Field}
              />
              <FieldElement
                text="Betalt arrangement"
                name="isPriced"
                component={CheckBox.Field}
              />
              {event.isPriced &&
                <div>
                  <FieldElement
                    text={
                      <Tooltip content="Manuell betaling kan også hukes av i etterkant">
                        Betaling igjennom Abakus.no
                      </Tooltip>
                    }
                    name="useStripe"
                    component={CheckBox.Field}
                  />
                  <FieldElement
                    text="Pris medlem"
                    name="priceMember"
                    type="number"
                    component={TextInput.Field}
                  />
                </div>}
            </ul>
            {loggedIn &&
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
                  <FieldArray
                    name="pools"
                    component={renderPools}
                    autocompleteResult={autocompleteResult}
                    groupQueryChanged={groupQueryChanged}
                  />
                </div>
                <FieldElement
                  text="Merge time"
                  name="mergeTime"
                  component={DatePicker.Field}
                />
                <Admin
                  actionGrant={actionGrant}
                  event={event}
                  deleteEvent={deleteEvent}
                />
              </Flex>}
          </Flex>
        </Flex>

        <Flex wrapReverse>
          <Flex column className={styles.join}>
            <FieldElement
              text="Bruk Captcha ved påmelding"
              name="useCaptcha"
              component={CheckBox.Field}
            />
            <Button disabled={pristine || submitting} submit>LAGRE</Button>

            {isEditPage &&
              <Link to={`/events/${event.id}`}>
                <Button>TILBAKE</Button>
              </Link>}
          </Flex>

          <Flex column className={styles.openFor}>
            <strong>Åpent for</strong>
            <ul>
              {(pools || [])
                .map(pool =>
                  (pool.permissionGroups || [])
                    .map(group => <li key={group.value}>{group.label}</li>)
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
    if (!data.description) {
      errors.description = 'Kalenderbeskrivelse er påkrevet';
    }
    if (!data.eventType) {
      errors.eventType = 'Arrangementstype er påkrevet';
    }
    return errors;
  }
})(EventEditor);
