import { ButtonGroup, Card, Flex } from '@webkom/lego-bricks';
import { isEmpty } from 'lodash-es';
import { Field } from 'react-final-form';
import { useLocation } from 'react-router-dom';
import {
  createAnnouncement,
  sendAnnouncement,
} from 'app/actions/AnnouncementsActions';
import {
  Form,
  CheckBox,
  LegoFinalForm,
  SelectInput,
  TextArea,
  RowSection,
} from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import Tooltip from 'app/components/Tooltip';
import { statusesText } from 'app/reducers/meetingInvitations';
import { selectAutocomplete } from 'app/reducers/search';
import { useAppDispatch } from 'app/store/hooks';
import { AutocompleteContentType } from 'app/store/models/Autocomplete';
import { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import { spyValues } from 'app/utils/formSpyUtils';
import {
  atLeastOneFieldRequired,
  createValidator,
  required,
} from 'app/utils/validation';
import styles from './AnnouncementsList.module.css';
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

export type AnnouncementCreateLocationState = {
  group?: UnknownGroup;
  event?: UnknownEvent;
  meeting?: UnknownMeeting;
};

export type FormValues = {
  message: string;
  users?: AutocompleteUser[];
  groups?: (AutocompleteGroup | SearchGroup)[];
  events?: (AutocompleteEvent | SearchEvent)[];
  excludeWaitingList?: boolean;
  meetings?: (AutocompleteMeeting | SearchMeeting)[];
  meetingInvitationStatus?: MeetingInvitationStatus;
  fromGroup?: AutocompleteGroup;
  send: boolean;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  message: [required('Du må skrive en melding')],
  users: [
    atLeastOneFieldRequired(
      ['users', 'groups', 'events', 'meetings'],
      'Du må velge minst én mottaker',
    ),
  ],
});

const AnnouncementsCreate = () => {
  const location = useLocation();
  const state = location.state as AnnouncementCreateLocationState;

  const dispatch = useAppDispatch();

  const initialValues: FormValues = {
    groups: state?.group
      ? selectAutocomplete([
          {
            contentType: AutocompleteContentType.Group,
            ...state.group,
          },
        ])
      : [],
    events: state?.event
      ? selectAutocomplete([
          {
            contentType: AutocompleteContentType.Event,
            ...state.event,
          },
        ])
      : [],
    meetings: state?.meeting
      ? selectAutocomplete([
          {
            contentType: AutocompleteContentType.Meeting,
            ...state.meeting,
          },
        ])
      : [],
    users: [],
    message: '',
    excludeWaitingList: false,
    send: false,
  };

  const onSubmit = (values: FormValues, form: FormApi<FormValues>) => {
    dispatch(
      createAnnouncement({
        ...values,
        users: values.users?.map((user) => user.value),
        groups: values.groups?.map((group) => group.value),
        meetings: values.meetings?.map((meeting) => meeting.value),
        meetingInvitationStatus: values.meetingInvitationStatus?.value,
        events: values.events?.map((event) => event.value),
        fromGroup: values.fromGroup?.value,
      }),
    ).then((result) => {
      if (values.send) {
        dispatch(sendAnnouncement(result.payload.result));
      }
      form.reset();
    });
  };

  return (
    <div>
      <h2>Ny kunngjøring</h2>
      <TypedLegoForm
        validate={validate}
        validateOnSubmitOnly
        onSubmit={onSubmit}
        initialValues={initialValues}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              name="message"
              component={TextArea.Field}
              placeholder="Skriv din melding her ..."
              label="Melding"
              required
            />
            <div>
              <span className={styles.formHeaders}>Mottakere</span>
              <Flex column gap="var(--spacing-sm)">
                <RowSection className={styles.rowRec}>
                  <Field
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
                </RowSection>
                <RowSection className={styles.rowRec}>
                  <Field
                    name="events"
                    placeholder="Arrangementer"
                    filter={['events.event']}
                    isMulti
                    component={SelectInput.AutocompleteField}
                  />
                  {spyValues<FormValues>((values) => {
                    const disabled = isEmpty(values.events);
                    return (
                      <Flex width="100%">
                        <Tooltip
                          content="Velg minst ett arrangement"
                          disabled={!disabled}
                        >
                          <Field
                            name="excludeWaitingList"
                            label="Ekskluder venteliste"
                            component={CheckBox.Field}
                            disabled={disabled}
                          />
                        </Tooltip>
                      </Flex>
                    );
                  })}
                </RowSection>
                <RowSection className={styles.rowRec}>
                  <Field
                    name="meetings"
                    placeholder="Møter"
                    filter={['meetings.meeting']}
                    isMulti
                    component={SelectInput.AutocompleteField}
                  />
                  <Field
                    name="meetingInvitationStatus"
                    placeholder="Filtrer på deltagelsesstatus til møtet"
                    component={SelectInput.Field}
                    options={Object.values(MeetingInvitationStatus).map(
                      (status) => ({
                        label: statusesText[status],
                        value: status,
                      }),
                    )}
                  />
                </RowSection>
              </Flex>
            </div>
            <Field
              name="fromGroup"
              placeholder="Velg gruppe"
              filter={['users.abakusgroup']}
              component={SelectInput.AutocompleteField}
              label="Send på vegne av gruppe"
              isClearable
            />

            <Card severity="info">
              Du kan velge å opprette og sende kunngjøringen med en gang, eller
              kun opprette og heller sende den senere fra listen nedenfor.
            </Card>

            {spyValues<FormValues>((values) => (
              <ButtonGroup>
                <SubmitButton
                  onPress={() => {
                    values.send = false;
                  }}
                >
                  Opprett
                </SubmitButton>
                <SubmitButton
                  onPress={() => {
                    values.send = true;
                  }}
                >
                  Opprett og send
                </SubmitButton>
              </ButtonGroup>
            ))}
          </Form>
        )}
      </TypedLegoForm>
    </div>
  );
};

export default AnnouncementsCreate;
