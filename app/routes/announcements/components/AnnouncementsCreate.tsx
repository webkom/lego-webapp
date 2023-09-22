import { Button, Card, Flex } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom-v5-compat';
import { createAnnouncement } from 'app/actions/AnnouncementsActions';
import { ContentMain } from 'app/components/Content';
import { LegoFinalForm, SelectInput, TextArea } from 'app/components/Form';
import type { ActionGrant } from 'app/models';
import { selectAutocomplete } from 'app/reducers/search';
import { useAppDispatch } from 'app/store/hooks';
import {
  atLeastOneFieldRequired,
  createValidator,
  required,
} from 'app/utils/validation';
import styles from './AnnouncementsList.css';

type Props = {
  actionGrant: ActionGrant;
};

const validate = createValidator({
  message: [required('Du må skrive en melding')],
  users: [
    atLeastOneFieldRequired(
      ['users', 'groups', 'events', 'meetings'],
      'Du må velge minst én mottaker'
    ),
  ],
});

const AnnouncementsCreate = ({ actionGrant }: Props) => {
  const [shouldSend, setShouldSend] = useState(false);

  const location = useLocation();

  const initialValues = {
    groups: location.state?.group
      ? selectAutocomplete([
          {
            contentType: 'users.abakusgroup',
            ...location.state?.group,
          },
        ])
      : [],
    events: location.state?.event
      ? selectAutocomplete([
          {
            contentType: 'events.event',
            ...location.state?.event,
          },
        ])
      : [],
    meetings: location.state?.meeting
      ? selectAutocomplete([
          {
            contentType: 'meetings.meeting',
            ...location.state?.meeting,
          },
        ])
      : [],
    users: [],
  };

  const dispatch = useAppDispatch();

  const onSubmit = (values, form) => {
    dispatch(
      createAnnouncement({
        ...values,
        users: values.users.map((user) => user.value),
        groups: values.groups.map((group) => group.value),
        meetings: values.meetings.map((meeting) => meeting.value),
        events: values.events.map((event) => event.value),
        fromGroup: values.fromGroup && values.fromGroup.value,
        send: shouldSend,
      })
    ).then(() => {
      form.reset();
    });
  };

  return (
    <ContentMain>
      <Helmet title="Kunngjøringer" />
      {actionGrant.includes('create') && (
        <Flex column>
          <h1>Ny kunngjøring</h1>
          <LegoFinalForm
            validate={validate}
            onSubmit={onSubmit}
            initialValues={initialValues}
            validateOnSubmitOnly
            className={styles.form}
          >
            {({ handleSubmit, pristine, submitting }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  className={styles.msgField}
                  name="message"
                  component={TextArea.Field}
                  placeholder="Skriv din melding her ..."
                  label="Kunngjøring"
                  required
                />
                <span className={styles.formHeaders}>Mottakere</span>
                <Flex className={styles.rowRec}>
                  <Field
                    className={styles.recField}
                    name="users"
                    placeholder="Brukere"
                    filter={['users.user']}
                    isMulti
                    component={SelectInput.AutocompleteField}
                  />
                  <Field
                    name="groups"
                    placeholder="Grupper"
                    filter={['users.abakusgroup']}
                    isMulti
                    component={SelectInput.AutocompleteField}
                  />
                </Flex>
                <Flex className={styles.rowRec}>
                  <Field
                    className={styles.recField}
                    name="events"
                    placeholder="Arrangementer"
                    filter={['events.event']}
                    isMulti
                    component={SelectInput.AutocompleteField}
                  />
                  <Field
                    name="meetings"
                    placeholder="Møter"
                    filter={['meetings.meeting']}
                    isMulti
                    component={SelectInput.AutocompleteField}
                  />
                </Flex>
                <Field
                  name="fromGroup"
                  placeholder="Fra gruppe"
                  filter={['users.abakusgroup']}
                  component={SelectInput.AutocompleteField}
                  label="Send på vegne av"
                />

                <Flex wrap>
                  <Button
                    onClick={() => {
                      setShouldSend(false);
                      handleSubmit();
                    }}
                    disabled={pristine || submitting}
                  >
                    Opprett
                  </Button>
                  <Button
                    onClick={() => {
                      setShouldSend(true);
                      handleSubmit();
                    }}
                    disabled={pristine || submitting}
                  >
                    Opprett og send
                  </Button>
                </Flex>
                <Card severity="info">
                  Du kan velge å sende kunngjøringen med en gang, eller lagre
                  den og sende den senere fra listen nedenfor.
                </Card>
              </form>
            )}
          </LegoFinalForm>
        </Flex>
      )}
    </ContentMain>
  );
};

export default AnnouncementsCreate;
