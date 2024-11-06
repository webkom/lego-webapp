import {
  ButtonGroup,
  ConfirmModal,
  Flex,
  Icon,
  LoadingPage,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { unionBy } from 'lodash';
import { Trash2 } from 'lucide-react';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field, FormSpy } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMemberships } from 'app/actions/GroupActions';
import {
  createMeeting,
  deleteMeeting,
  editMeeting,
  fetchMeeting,
  inviteUsersAndGroups,
} from 'app/actions/MeetingActions';
import {
  createMeetingTemplate,
  fetchAllMeetingTemplates,
} from 'app/actions/MeetingTemplateActions';
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
import Attendance from 'app/components/UserAttendance/Attendance';
import config from 'app/config';
import { useCurrentUser } from 'app/reducers/auth';
import { selectMeetingInvitationsForMeeting } from 'app/reducers/meetingInvitations';
import { selectAllMeetingTemplates } from 'app/reducers/meetingTemplates';
import { selectMeetingById } from 'app/reducers/meetings';
import { selectUserById } from 'app/reducers/users';
import styles from 'app/routes/meetings/components/MeetingEditor.module.css';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EDITOR_EMPTY } from 'app/utils/constants';
import { spyValues } from 'app/utils/formSpyUtils';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import {
  createValidator,
  ifField,
  ifNotField,
  legoEditorRequired,
  required,
  timeIsAfter,
} from 'app/utils/validation';
import type { EntityId } from '@reduxjs/toolkit';
import type { AutocompleteGroup } from 'app/store/models/Group';
import type { DetailedMeeting } from 'app/store/models/Meeting';
import type { AutocompleteUser } from 'app/store/models/User';

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
  id?: EntityId;
  title?: string;
  report?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  useMazemap: boolean;
  mazemapPoi?: { value: number; label: string };
  location?: string;
  reportAuthor?: { value: EntityId; label: string; id: EntityId };
  users?: AutocompleteUser[];
  groups?: AutocompleteGroup[];
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

type MeetingEditorParams = {
  meetingId?: string;
};
const MeetingEditor = () => {
  const [meetingRefreshKey, setMeetingRefreshkey] = useState(0);
  const { meetingId } = useParams<MeetingEditorParams>();
  const isEditPage = meetingId !== undefined;
  const meeting = useAppSelector((state) =>
    meetingId
      ? (selectMeetingById(state, meetingId) as DetailedMeeting)
      : undefined,
  );
  const meetingInvitations = useAppSelector((state) =>
    meetingId
      ? selectMeetingInvitationsForMeeting(state, meetingId)
      : undefined,
  );
  const reportAuthor = useAppSelector((state) =>
    meeting?.reportAuthor
      ? selectUserById(state, meeting?.reportAuthor)
      : undefined,
  );
  const fetching = useAppSelector((state) => state.meetings.fetching);

  const currentUser = useCurrentUser();

  const [fetchedGroupIds, setFetchedGroupIds] = useState<EntityId[]>([]);
  const [invitedGroupMembers, setInvitedGroupMembers] = useState<
    { value: string; label: string; id: EntityId; groupId: EntityId }[]
  >([]);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchMeetingEdit',
    () => meetingId && dispatch(fetchMeeting(meetingId)),
    [],
  );

  const fetchAndSetGroupMembers = async (groupId: number) => {
    dispatch(fetchMemberships({ groupId, propagateError: false }))
      .then((res) => {
        setFetchedGroupIds((prevIds) => [...prevIds, groupId]);

        const members = Object.values(res.payload.entities.users || {}).map(
          (member) => ({
            value: member.username,
            label: member.fullName,
            id: member.id,
            groupId: groupId,
          }),
        );
        setInvitedGroupMembers((prevMembers) => [...prevMembers, ...members]);
      })
      .catch((error) => {
        // Allow users to invite groups they can't see the members of
        if (error?.payload?.response?.status === 403) {
          setFetchedGroupIds((prevIds) => [...prevIds, groupId]);
          return;
        }
        throw error;
      });
  };

  usePreparedEffect(
    'loadMeetingTemplates',
    () => {
      dispatch(fetchAllMeetingTemplates());
    },
    [],
  );
  const [selectedTemplate, setSelectedTemplate] = useState<EntityId>(null);

  const allMeetingTemplates = useAppSelector(selectAllMeetingTemplates);
  const navigate = useNavigate();

  if (isEditPage && !meeting) {
    return <LoadingPage loading />; // TODO: proper loading behavior once separate fetching state is implemented
  }

  const currentUserSearchable = currentUser && {
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
            }),
          ).then(() => navigate(`/meetings/${id}`));
        }

        navigate(`/meetings/${id}`);
      },
    );

  const onDeleteMeeting = isEditPage
    ? () =>
        dispatch(deleteMeeting(meeting.id)).then(() => navigate('/meetings/'))
    : undefined;

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
        useMazemap: meeting.mazemapPoi !== undefined && meeting.mazemapPoi > 0,
      }
    : {
        startTime: time(16, 15),
        endTime: time(18),
        report: EDITOR_EMPTY,
        useMazemap: true,
      };

  const title = isEditPage ? `Redigerer: ${meeting.title}` : 'Nytt møte';

  return (
    <Page
      title={title}
      skeleton={fetching}
      back={{
        label: `${isEditPage ? 'Tilbake' : 'Dine møter'}`,
        href: `/meetings/${isEditPage ? meetingId : ''}`,
      }}
    >
      <Helmet title={title} />

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
                key={meetingRefreshKey}
              />

              <ConfirmModal
                title="Bruk møtemal"
                message="Du vil overskrive dine nåværende endringer"
                onConfirm={() => {
                  const template = allMeetingTemplates.find(
                    (t) => t.id === selectedTemplate,
                  );

                  if (template) {
                    form.change('title', template.name);
                    form.change('report', template.report);
                    form.change('startTime', template.startTime);
                    form.change('endTime', template.endTime);
                    form.change(
                      'reportAuthor',
                      template.reportAuthor && {
                        value: template.reportAuthor.username,
                        label: template.reportAuthor.fullName,
                        id: template.reportAuthor.id,
                      },
                    );

                    form.change(
                      'users',
                      template?.invitedUsers.map((user) => ({
                        value: user.username,
                        label: user.fullName,
                        id: user.id,
                      })),
                    );
                    form.change(
                      'groups',
                      template?.invitedGroups.map((group) => ({
                        value: group.id,
                        label: group.name,
                        id: group.id,
                      })),
                    );
                    if (template.mazemapPoi) {
                      form.change('mazemapPoi', template.mazemapPoi);
                    } else {
                      form.change('useMazemap', false);
                      form.change('location', template.location);
                    }
                    setMeetingRefreshkey((prev) => prev + 1);
                  }
                }}
                closeOnConfirm
              >
                {({ openConfirmModal }) => (
                  <Field
                    name="template"
                    label="Velg en møtemal"
                    placeholder="Velg møtemal"
                    component={SelectInput.Field}
                    options={allMeetingTemplates.map((template) => ({
                      label: template.name,
                      value: template.id,
                    }))}
                    isSearchable={false}
                    onChange={(selectedOption) => {
                      setSelectedTemplate(selectedOption.value);
                      openConfirmModal();
                    }}
                  />
                )}
              </ConfirmModal>

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
                              .toISOString(),
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
                type="checkbox"
                component={CheckBox.Field}
                withoutMargin
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
                    !invitingGroups.some(
                      (group) => group.id === fetchedGroupId,
                    ),
                );
                if (removedGroupIds.length > 0) {
                  setInvitedGroupMembers((prevMembers) =>
                    prevMembers.filter(
                      (member) => !removedGroupIds.includes(member.groupId),
                    ),
                  );

                  setFetchedGroupIds((prevIds) =>
                    prevIds.filter((id) => !removedGroupIds.includes(id)),
                  );
                }

                const possibleReportAuthors = unionBy(
                  [currentUserSearchable],
                  invitedUsersSearchable,
                  invitedGroupMembers,
                  invitingUsers,
                  'value',
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
                    <Attendance
                      isMeeting
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
              <ButtonGroup>
                <Button
                  flat
                  onPress={() =>
                    navigate(`/meetings/${isEditPage ? meeting.id : ''}`)
                  }
                >
                  Avbryt
                </Button>
                <Button
                  onPress={() => {
                    const report = form.getFieldState('report')?.value;
                    const name = form.getFieldState('title')?.value;
                    const location = form.getFieldState('location')?.value;
                    const startTime = form.getFieldState('startTime')?.value;
                    const endTime = form.getFieldState('endTime')?.value;
                    const description =
                      form.getFieldState('description')?.value;
                    const mazemapPoi = form.getFieldState('mazemapPoi')?.value;
                    const reportAuthor =
                      form.getFieldState('reportAuthor')?.value?.id;

                    const invitedUsers = form
                      .getFieldState('users')
                      ?.value?.map((user) => user.id);

                    const invitedGroups = form
                      .getFieldState('groups')
                      ?.value?.map((group) => group.id);

                    dispatch(
                      createMeetingTemplate({
                        name,
                        report,
                        location,
                        startTime,
                        endTime,
                        description,
                        mazemapPoi,
                        reportAuthor,
                        invitedUsers,
                        invitedGroups,
                      }),
                    );
                  }}
                >
                  Lagre som møtemal
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
                      <Button onPress={openConfirmModal} danger>
                        <Icon iconNode={<Trash2 />} size={19} />
                        Slett møtet
                      </Button>
                    )}
                  </ConfirmModal>
                )}
              </ButtonGroup>
            </Form>
          );
        }}
      </LegoFinalForm>
    </Page>
  );
};

export default guardLogin(MeetingEditor);
