// @flow

import React from 'react';
import Helmet from 'react-helmet';
import styles from './AnnouncementsList.css';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import Flex from 'app/components/Layout/Flex';
import { Form, SelectInput, EditorField } from 'app/components/Form';
import { reduxForm, Field } from 'redux-form';
import { TextEditorComponent } from 'app/routes/joblistings/components/JoblistingEditorItems';
import Button from 'app/components/Button';

type Props = {
  announcement: Object,
  announcements: Array,
  actionGrant: Array,
  submitAnnouncement: () => void
};

function AnnouncementItem({ announcement }: Props) {
  return (
    <Flex column padding="10px 0">
      <Flex className={styles.date}>
        {announcement.sent || '01.09.17 kl. 17:54'}
      </Flex>
      <Flex className={styles.msg}>
        {announcement.message}
      </Flex>
      <Flex>Mottakere: webkom, webkom, webkom</Flex>
    </Flex>
  );
}

const AutoField = ({ text, name, placeholder }) =>
  <Flex>
    <Field
      placeholder={placeholder}
      name={name}
      component={SelectInput.AutocompleteField}
      filter={['groups.group']}
    />
  </Flex>;

const AnnouncementsList = ({
  submitAnnouncement,
  announcements,
  actionGrant
}: Props) => {
  if (!announcements) {
    return <LoadingIndicator loading />;
  }
  return (
    <div className={styles.root}>
      <Helmet title="Kunngjøringer" />
      <Flex column alignItems="center">
        <Flex column className={styles.form}>
          <h2 className={styles.header}>Ny kunngjøring</h2>
          <Form onSubmit={submitAnnouncement}>
            <Flex column>
              Kunngjøring:
              <Field
                className={styles.msgField}
                name="message"
                component={EditorField}
                placeholder="Skriv din melding her..."
              />
            </Flex>; Mottakere:
            <AutoField text="Brukere: " name="users" placeholder="Brukere" />
            <AutoField text="Grupper: " name="groups" placeholder="Grupper" />
            <AutoField
              text="Arrangementer: "
              name="events"
              placeholder="Arrangementer"
            />
            <AutoField text="Møter: " name="meetings" placeholder="Møter" />
            <Button submit>Lagre</Button>
          </Form>
        </Flex>
        <Flex>
          <h1 className={styles.header}> Mine kunngjøringer </h1>
        </Flex>
        <Flex column>
          {Object.values(announcements).map((a, i) =>
            <AnnouncementItem key={i} announcement={a} />
          )}
        </Flex>
      </Flex>
    </div>
  );
};

export default reduxForm({
  form: 'announcementsList',
  enableReinitialize: true,
  validate(values) {
    const errors = {};
    if (!values.message) {
      errors.message = 'Du må skrive en melding';
    }
    return errors;
  }
})(AnnouncementsList);
