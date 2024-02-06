import { Card, Flex } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { createAnnouncement } from 'app/actions/AnnouncementsActions';
import { ContentMain } from 'app/components/Content';
import { LegoFinalForm, SelectInput, TextArea } from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectAutocomplete } from 'app/reducers/search';
import { useAppDispatch } from 'app/store/hooks';
import { AutocompleteContentType } from 'app/store/models/Autocomplete';
import { spyValues } from 'app/utils/formSpyUtils';
import {
  atLeastOneFieldRequired,
  createValidator,
  required,
} from 'app/utils/validation';
import styles from './AnnouncementsList.css';
import type { ActionGrant } from 'app/models';
import type {
  AutocompleteEvent,
  SearchEvent,
  UnknownEvent,
} from 'app/store/models/Event';
import type {
  AutocompleteGroup,
  SearchGroup,
  UnknownGroup,
} from 'app/store/models/Group';
import type {
  AutocompleteMeeting,
  SearchMeeting,
  UnknownMeeting,
} from 'app/store/models/Meeting';
import type { AutocompleteUser } from 'app/store/models/User';
import type { FormApi } from 'final-form';

type Props = {
  actionGrant: ActionGrant;
};

export type AnnouncementCreateLocationState = {
  group?: UnknownGroup;
  event?: UnknownEvent;
  meeting?: UnknownMeeting;
};

type FormValues = {
  message: string;
  users?: AutocompleteUser[];
  groups?: (AutocompleteGroup | SearchGroup)[];
  events?: (AutocompleteEvent | SearchEvent)[];
  meetings?: (AutocompleteMeeting | SearchMeeting)[];
  fromGroup?: AutocompleteGroup;
  send: boolean;
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
  const location = useLocation<AnnouncementCreateLocationState>();
  const dispatch = useAppDispatch();

  const initialValues: FormValues = {
    groups: location.state?.group
      ? selectAutocomplete([
          {
            contentType: AutocompleteContentType.Group,
            ...location.state?.group,
          },
        ])
      : [],
    events: location.state?.event
      ? selectAutocomplete([
          {
            contentType: AutocompleteContentType.Event,
            ...location.state?.event,
          },
        ])
      : [],
    meetings: location.state?.meeting
      ? selectAutocomplete([
          {
            contentType: AutocompleteContentType.Meeting,
            ...location.state?.meeting,
          },
        ])
      : [],
    users: [],
    message: '',
    send: false,
  };

  const onSubmit = (values: FormValues, form: FormApi<FormValues>) => {
    dispatch(
      createAnnouncement({
        message: values.message,
        users: values.users.map((user) => user.value),
        groups: values.groups.map((group) => group.value),
        meetings: values.meetings.map((meeting) => meeting.value),
        events: values.events.map((event) => event.value),
        fromGroup: values.fromGroup && values.fromGroup.value,
        send: values.send,
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
            validateOnSubmitOnly
            onSubmit={onSubmit}
            initialValues={initialValues}
            className={styles.form}
            subscription={{}}
          >
            {({ handleSubmit }) => (
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
                  isClearable
                />

                {spyValues((values: FormValues) => (
                  <Flex wrap>
                    <SubmitButton
                      onClick={(e) => {
                        values.send = false;
                        handleSubmit(e);
                      }}
                    >
                      Opprett
                    </SubmitButton>
                    <SubmitButton
                      onClick={(e) => {
                        values.send = true;
                        handleSubmit(e);
                      }}
                    >
                      Opprett og send
                    </SubmitButton>
                  </Flex>
                ))}
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
