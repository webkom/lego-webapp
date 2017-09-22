// @flow

import React from 'react';
import Helmet from 'react-helmet';
import styles from './AnnouncementsList.css';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import Flex from 'app/components/Layout/Flex';
import { Form, SelectInput, TextArea } from 'app/components/Form';
import { reduxForm, Field } from 'redux-form';
import Button from 'app/components/Button';
import AnnouncementItem from './AnnouncementItem';

type Props = {
  announcement: Object,
  announcements: Array,
  actionGrant: Array,
  sendAnnouncement: () => void,
  createAnnouncement: () => void,
  deleteAnnouncement: () => void,
  handleSubmit: () => void,
  invalid: string,
  pristine: string,
  submitting: string
};

const AnnouncementsList = ({
  createAnnouncement,
  sendAnnouncement,
  deleteAnnouncement,
  announcements,
  actionGrant,
  handleSubmit,
  invalid,
  pristine,
  submitting
}: Props) => {
  if (announcements.fetching) {
    return <LoadingIndicator loading />;
  }
  const disabledButton = invalid | pristine | submitting;
  const onSubmit = (announcement, send = false) => {
    return createAnnouncement({
      ...announcement,
      users: announcement.users
        ? announcement.users.map(user => user.value)
        : [],
      groups: announcement.groups
        ? announcement.groups.map(group => group.value)
        : [],
      meetings: announcement.meetings
        ? announcement.meetings.map(meeting => meeting.value)
        : [],
      events: announcement.events
        ? announcement.events.map(event => event.value)
        : [],
      send
    });
  };

  return (
    <div className={styles.root}>
      <Helmet title="Kunngjøringer" />
      {actionGrant.includes('create') && (
        <Flex column>
          <h2 className={styles.header}>Ny kunngjøring</h2>
          <Form className={styles.form}>
            <Field
              className={styles.msgField}
              name="message"
              component={TextArea.Field}
              placeholder="Skriv din melding her..."
              label="Kunngjøring:"
            />
            <span className={styles.formHeaders}>Mottakere:</span>
            <Flex className={styles.rowRec}>
              <Field
                className={styles.recField}
                name="users"
                placeholder="Brukere"
                filter={['users.user']}
                multi
                component={SelectInput.AutocompleteField}
              />
              <Field
                name="groups"
                placeholder="Grupper"
                filter={['users.abakusgroup']}
                multi
                component={SelectInput.AutocompleteField}
              />
            </Flex>
            <Flex className={styles.rowRec}>
              <Field
                className={styles.recField}
                name="events"
                placeholder="Arrangementer"
                filter={['events.event']}
                multi
                component={SelectInput.AutocompleteField}
              />
              <Field
                name="meetings"
                placeholder="Møter"
                filter={['meetings.meeting']}
                multi
                component={SelectInput.AutocompleteField}
              />
            </Flex>
            <Flex>
              <Button
                onClick={handleSubmit(values => onSubmit(values, false))}
                disabled={disabledButton}
              >
                Opprett
              </Button>
              <Button
                onClick={handleSubmit(values => onSubmit(values, true))}
                disabled={disabledButton}
              >
                Opprett og send
              </Button>
            </Flex>
          </Form>
        </Flex>
      )}
      {actionGrant.includes('list') && (
        <Flex column>
          <h1 className={styles.header}> Mine kunngjøringer </h1>
          <Flex column className={styles.list}>
            {announcements.map((a, i) => (
              <AnnouncementItem
                key={i}
                announcement={a}
                sendAnnouncement={sendAnnouncement}
                deleteAnnouncement={deleteAnnouncement}
                actionGrant={actionGrant}
              />
            ))}
          </Flex>
        </Flex>
      )}
    </div>
  );
};

export default reduxForm({
  form: 'announcementsList',
  validate(values) {
    const errors = {};
    if (!values.message) {
      errors.message = 'Du må skrive en melding';
    }
    if (!values.groups && !values.meetings && !values.events && !values.users) {
      errors.users = 'Du må velge minst én mottaker';
    }
    return errors;
  }
})(AnnouncementsList);
