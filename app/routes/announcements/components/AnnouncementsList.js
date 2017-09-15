// @flow

import React from 'react';
import Helmet from 'react-helmet';
import styles from './AnnouncementsList.css';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import Flex from 'app/components/Layout/Flex';
import { Form, SelectInput, EditorField } from 'app/components/Form';
import { reduxForm, Field } from 'redux-form';
import Button from 'app/components/Button';
import { Link } from 'react-router';

type Props = {
  announcement: Object,
  announcements: Array,
  actionGrant: Array,
  submitAnnouncement: () => void,
  handleSubmit: () => void
};

function AnnouncementItem({ announcement }: Props) {
  return (
    <Flex column padding="10px 0">
      <Flex className={styles.date}>
        {announcement.sent || 'Fant ingen dato'}
      </Flex>
      <Flex className={styles.msg}>{announcement.message}</Flex>
      <Flex column>
        <span className={styles.recHeader}>Mottakere:</span>
        <Flex wrap>
          {announcement.events.length > 0 ? 'Arrangementer: ' : ''}
          {announcement.events.map((e, i) => (
            <Link key={i} className={styles.recipients} to={`/events/${e.id}/`}>
              {e.title}
            </Link>
          ))}
        </Flex>
        <Flex wrap>
          {announcement.meetings.length > 0 ? 'Møter: ' : ''}
          {announcement.meetings.map((m, i) => (
            <Link
              key={i}
              className={styles.recipients}
              to={`/meetings/${m.id}/`}
            >
              {m.title}
            </Link>
          ))}
        </Flex>
        <Flex wrap>
          {announcement.groups.length > 0 ? 'Grupper: ' : ''}
          {announcement.groups.map((g, i) => (
            <Link key={i} className={styles.recipients} to={`/groups/${g.id}/`}>
              {g.name}
            </Link>
          ))}
        </Flex>
        <Flex wrap>
          {announcement.users.length > 0 ? 'Brukere: ' : ''}
          {announcement.users.map((u, i) => (
            <Link
              key={i}
              className={styles.recipients}
              to={`/users/${u.username}/`}
            >
              {u.fullName}
            </Link>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

const AnnouncementsList = ({
  submitAnnouncement,
  announcements,
  actionGrant,
  handleSubmit
}: Props) => {
  if (!announcements) {
    return <LoadingIndicator loading />;
  }

  function onSubmit(announcement) {
    announcement.users = announcement.users
      ? announcement.users.map(u => u.value)
      : [];
    announcement.groups = announcement.groups
      ? announcement.groups.map(u => u.value)
      : [];
    announcement.meetings = announcement.meetings
      ? announcement.meetings.map(u => u.value)
      : [];
    announcement.events = announcement.events
      ? announcement.events.map(u => u.value)
      : [];
    submitAnnouncement(announcement);
  }

  return (
    <div className={styles.root}>
      <Helmet title="Kunngjøringer" />
      <Flex column>
        <h2 className={styles.header}>Ny kunngjøring</h2>
        <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <span className={styles.formHeaders}>Kunngjøring:</span>
          <Field
            className={styles.msgField}
            name="message"
            component={EditorField}
            placeholder="Skriv din melding her..."
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
              filter={['users.group']}
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
              text="Møter:"
              name="meetings"
              placeholder="Møter"
              filter={['meetings.meeting']}
              multi
              component={SelectInput.AutocompleteField}
            />
          </Flex>
          <Button submit>Send</Button>
        </Form>
      </Flex>
      <Flex>
        <h1 className={styles.header}> Mine kunngjøringer </h1>
      </Flex>
      <Flex column className={styles.list}>
        {Object.values(announcements).map((a, i) => (
          <AnnouncementItem key={i} announcement={a} />
        ))}
      </Flex>
    </div>
  );
};

export default reduxForm({
  form: 'announcementsList',
  validate(values) {
    const errors = {};
    if (!values.message || values.message.trim() === '<p></p>') {
      errors.message = 'Du må skrive en melding';
    }
    if (!values.groups && !values.meetings && !values.events && !values.users) {
      errors.users = 'Du må velge minst én mottaker';
    }
    return errors;
  }
})(AnnouncementsList);
