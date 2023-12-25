import {
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { unionBy } from 'lodash';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field, FormSpy } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import { fetchMemberships } from 'app/actions/GroupActions';
import { Content } from 'app/components/Content';
import {
  Button,
  CheckBox,
  DatePicker,
  EditorField,
  Form,
  SelectInput,
  TextArea,
  TextInput,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import MazemapLink from 'app/components/MazemapEmbed/MazemapLink';
import NavigationTab from 'app/components/NavigationTab';
import { AttendanceStatus } from 'app/components/UserAttendance';
import config from 'app/config';
import { selectMeetingById } from 'app/reducers/meetings';
import { useUserContext } from 'app/routes/app/AppRoute';
import styles from 'app/routes/meetings/components/MeetingEditor.css';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EDITOR_EMPTY } from 'app/utils/constants';
import { spyValues } from 'app/utils/formSpyUtils';
import {
  createValidator,
  ifField,
  ifNotField,
  legoEditorRequired,
  required,
  timeIsAfter,
} from 'app/utils/validation';
import {
  selectMeetingInvitationsForMeeting,
  type MeetingInvitationWithUser,
} from 'app/reducers/meetingInvitations';
import type { ID } from 'app/store/models';
import type { AutocompleteGroup } from 'app/store/models/Group';
import type { DetailedMeeting } from 'app/store/models/Meeting';
import type { AutocompleteUser, CurrentUser } from 'app/store/models/User';
import type { History } from 'history';
import { selectUserById } from 'app/reducers/users';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { usePreparedEffect } from '@webkom/react-prepare';
import {
  createMeeting,
  deleteMeeting,
  editMeeting,
  fetchMeeting,
  inviteUsersAndGroups,
} from 'app/actions/MeetingActions';
import { useNavigate } from 'react-router-dom-v5-compat';

const time = (hours: number, minutes?: number) =>
  moment()
    .tz(config.timezone)
    .startOf('day')
    .add({
      hours,
      minutes,
    })
    .toISOString();

export type MeetingFormValues = {
  id?: ID;
  title?: string;
  report?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  useMazemap: boolean;
  mazemapPoi?: { value: number; label: string };
  location?: string;
  reportAuthor?: { value: ID; label: string; id: ID };
  users?: AutocompleteUser[];
  groups?: AutocompleteGroup[];
};

type Props = {
  meetingId?: string;
  meeting: DetailedMeeting;
  currentUser: CurrentUser;
  meetingInvitations: MeetingInvitationWithUser[];
  initialValues: MeetingFormValues;
  handleSubmitCallback: (
    data: MeetingFormValues
  ) => Promise<{ payload: { result: ID } }>;
  push: History['push'];
  inviteUsersAndGroups: (args: {
    id: ID;
    users: [
      {
        id: ID;
      }
    ];
    groups: [
      {
        value: ID;
      }
    ];
  }) => Promise<void>;
  deleteMeeting: (args: ID) => Promise<void>;
};

const validate = createValidator({
  title: [required('Du må gi møtet en tittel')],
  report: [legoEditorRequired('Referatet kan ikke være tomt')],
  location: [
    ifNotField('useMazemap', required('Sted eller Mazemap-rom er påkrevd')),
  ],
  mazemapPoi: [
    ifField('useMazemap', required('Sted eller Mazemap-rom er påkrevd')),
  ],
  startTime: [required('Du må velge starttidspunkt')],
  endTime: [
    required('Du må velge sluttidspunkt'),
    timeIsAfter('startTime', 'Sluttidspunkt kan ikke være før starttidspunkt'),
  ],
});

const MeetingEditor = () => {
  const { meetingId } = useParams<{ meetingId?: string }>();
  const isEditPage = meetingId !== undefined;
  const meeting = useAppSelector((state) =>
    selectMeetingById(state, { meetingId })
  );
  const meetingInvitations = useAppSelector((state) =>
    selectMeetingInvitationsForMeeting(state, {
      meetingId,
    })
  );
  const reportAuthor = useAppSelector((state) =>
    selectUserById(state, {
      userId: meeting?.reportAuthor,
    })
  );

  const { currentUser } = useUserContext();

  const [fetchedGroupIds, setFetchedGroupIds] = useState<ID[]>([]);
  const [invitedGroupMembers, setInvitedGroupMembers] = useState<
    { value: string; label: string; id: ID; groupId: ID }[]
  >([]);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchMeetingEdit',
    () => meetingId && dispatch(fetchMeeting(meetingId)),
    []
  );

  const fetchAndSetGroupMembers = async (groupId: number) => {
    dispatch(fetchMemberships(groupId)).then((res) => {
      setFetchedGroupIds((prevIds) => [...prevIds, groupId]);

      const members = Object.values(res.payload.entities.users || {}).map(
        (member) => ({
          value: member.username,
          label: member.fullName,
          id: member.id,
          groupId: groupId,
        })
      );
      setInvitedGroupMembers((prevMembers) => [...prevMembers, ...members]);
    });
  };

  const navigate = useNavigate();

  if (isEditPage && !meeting) {
    return <LoadingIndicator loading />;
  }

  const currentUserSearchable = {
    value: currentUser.username,
    label: currentUser.fullName,
    id: currentUser.id,
  };

  const invitedUsersSearchable = meetingInvitations
    ? meetingInvitations.map((invite) => ({
        value: invite.user.username,
        label: invite.user.fullName,
        id: invite.user.id,
      }))
    : [];

  const onSubmit = (values) =>
    dispatch(isEditPage ? editMeeting(values) : createMeeting(values)).then(
      (result) => {
        const id = meetingId || result.payload.result;
        const { groups, users } = values;

        if (groups || users) {
          return dispatch(
            inviteUsersAndGroups({
              id,
              users,
              groups,
            })
          ).then(() => navigate(`/meetings/${id}`));
        }

        navigate(`/meetings/${id}`);
      }
    );

  const onDeleteMeeting = () =>
    dispatch(deleteMeeting(meeting?.id)).then(() => navigate('/meetings/'));

  const actionGrant = meeting?.actionGrant;
  const canDelete = actionGrant?.includes('delete');

  const initialValues = isEditPage
    ? {
        ...meeting,
        reportAuthor: reportAuthor && {
          id: reportAuthor.id,
          value: reportAuthor.username,
          label: reportAuthor.fullName,
        },
        report: meeting.report,
        description: meeting.description ?? '',
        mazemapPoi: meeting.mazemapPoi && {
          label: meeting.location,
          value: meeting.mazemapPoi,
        },
        useMazemap: meeting.mazemapPoi > 0,
      }
    : {
        startTime: time(16, 15),
        endTime: time(18),
        report: EDITOR_EMPTY,
        useMazemap: true,
      };

  const title = isEditPage ? `Redigerer: ${meeting.title}` : 'Nytt møte';

  return (
    <Content>
      <Helmet title={title} />
      <NavigationTab
        title={title}
        className={styles.detailTitle}
        back={{
          label: `${isEditPage ? 'Tilbake' : 'Dine møter'}`,
          path: `/meetings/${isEditPage ? meetingId : ''}`,
        }}
      />
      <LegoFinalForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        subscription={{}}
      >
        {({ handleSubmit, form }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Field
                name="title"
                label="Tittel"
                placeholder="Ny tittel for møte"
                component={TextInput.Field}
              />
              <Field
                name="report"
                label="Referat"
                component={EditorField.Field}
              />
              <Field
                name="description"
                label="Kort beskrivelse"
                placeholder="Dette vises i kalenderen til de inviterte, så gjerne putt zoom-lenka her..."
                component={TextArea.Field}
              />
              <div className={styles.sideBySideBoxes}>
                <FormSpy subscription={{ values: true }}>
                  {({ values }) => (
                    <Field
                      name="startTime"
                      label="Starttidspunkt"
                      component={DatePicker.Field}
                      onBlur={(value: string) => {
                        const startTime = moment(value);
                        const endTime = moment(values.endTime);
                        if (endTime.isBefore(startTime)) {
                          form.change(
                            'endTime',
                            startTime
                              .clone()
                              .add(2, 'hours')
                              .set('minute', 0)
                              .toISOString()
                          );
                        }
                      }}
                    />
                  )}
                </FormSpy>
                <Field
                  name="endTime"
                  label="Sluttidspunkt"
                  component={DatePicker.Field}
                />
              </div>
              <Field
                label="Bruk mazemap"
                name="useMazemap"
                component={CheckBox.Field}
                type="checkbox"
              />
              {spyValues<MeetingFormValues>((values) => {
                return values?.useMazemap ? (
                  <Flex alignItems="center">
                    <Field
                      label="Mazemap-rom"
                      name="mazemapPoi"
                      component={SelectInput.MazemapAutocomplete}
                      fieldClassName={styles.metaField}
                      placeholder="R1, Abakus, Kjel4"
                    />
                    {values?.mazemapPoi?.value > 0 && (
                      <MazemapLink
                        mazemapPoi={values?.mazemapPoi?.value}
                        linkText="↗️"
                      />
                    )}
                  </Flex>
                ) : (
                  <Field
                    name="location"
                    label="Sted"
                    placeholder="Sted for møte"
                    component={TextInput.Field}
                  />
                );
              })}

              <div className={styles.sideBySideBoxes}>
                <div>
                  <Field
                    name="users"
                    filter={['users.user']}
                    label="Inviter brukere"
                    placeholder="Skriv inn brukernavn på de du vil invitere"
                    component={SelectInput.AutocompleteField}
                    isMulti
                  />
                </div>
                <div>
                  <Field
                    name="groups"
                    filter={['users.abakusgroup']}
                    label="Inviter grupper"
                    placeholder="Skriv inn gruppene du vil invitere"
                    component={SelectInput.AutocompleteField}
                    isMulti
                  />
                </div>
              </div>

              {spyValues<MeetingFormValues>((values) => {
                const invitingUsers = values?.users ?? [];
                const invitingGroups = values?.groups ?? [];

                const newGroupIds = invitingGroups
                  .filter((group) => !fetchedGroupIds.includes(group.id))
                  .map((group) => group.id);
                newGroupIds.forEach(fetchAndSetGroupMembers);

                const removedGroupIds = fetchedGroupIds.filter(
                  (fetchedGroupId) =>
                    !invitingGroups.some((group) => group.id === fetchedGroupId)
                );
                if (removedGroupIds.length > 0) {
                  setInvitedGroupMembers((prevMembers) =>
                    prevMembers.filter(
                      (member) => !removedGroupIds.includes(member.groupId)
                    )
                  );

                  setFetchedGroupIds((prevIds) =>
                    prevIds.filter((id) => !removedGroupIds.includes(id))
                  );
                }

                const possibleReportAuthors = unionBy(
                  [currentUserSearchable],
                  invitedUsersSearchable,
                  invitedGroupMembers,
                  invitingUsers,
                  'value'
                );

                return (
                  <Field
                    name="reportAuthor"
                    label="Referent"
                    options={possibleReportAuthors}
                    component={SelectInput.Field}
                  />
                );
              })}

              {isEditPage && (
                <>
                  <h3>Allerede inviterte</h3>
                  <div>
                    <AttendanceStatus.Modal
                      pools={[
                        {
                          name: 'Inviterte brukere',
                          registrations: meetingInvitations,
                        },
                      ]}
                    />
                    <br />
                  </div>
                </>
              )}

              <SubmissionError />
              <Flex wrap>
                <Button
                  flat
                  onClick={() =>
                    push(`/meetings/${isEditPage ? meeting.id : ''}`)
                  }
                >
                  Avbryt
                </Button>
                <SubmitButton>
                  {isEditPage ? 'Lagre endringer' : 'Opprett møte'}
                </SubmitButton>
                {isEditPage && canDelete && (
                  <ConfirmModal
                    title="Slett møtet"
                    message="Er du sikker på at du vil slette møtet?"
                    onConfirm={onDeleteMeeting}
                  >
                    {({ openConfirmModal }) => (
                      <Button onClick={openConfirmModal} danger>
                        <Icon name="trash" size={19} />
                        Slett møtet
                      </Button>
                    )}
                  </ConfirmModal>
                )}
              </Flex>
            </Form>
          );
        }}
      </LegoFinalForm>
    </Content>
  );
};

export default guardLogin(MeetingEditor);
