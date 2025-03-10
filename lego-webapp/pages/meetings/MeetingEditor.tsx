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
import { navigate } from 'vike/client/router';
import {
  Button,
  CheckBox,
  DatePicker,
  EditorField,
  Form,
  RowSection,
  SelectInput,
  TextArea,
  TextInput,
} from '~/components/Form';
import LegoFinalForm from '~/components/Form/LegoFinalForm';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import { mazemapScript } from '~/components/MazemapEmbed';
import MazemapLink from '~/components/MazemapEmbed/MazemapLink';
import Attendance from '~/components/UserAttendance/Attendance';
import { fetchMemberships } from '~/redux/actions/GroupActions';
import {
  createMeeting,
  deleteMeeting,
  editMeeting,
  fetchMeeting,
  inviteUsersAndGroups,
} from '~/redux/actions/MeetingActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectMeetingInvitationsForMeeting } from '~/redux/slices/meetingInvitations';
import { selectMeetingById } from '~/redux/slices/meetings';
import { selectUserById } from '~/redux/slices/users';
import { appConfig } from '~/utils/appConfig';
import { EDITOR_EMPTY } from '~/utils/constants';
import { spyValues } from '~/utils/formSpyUtils';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import {
  createValidator,
  datesAreInCorrectOrder,
  dateRequired,
  ifField,
  ifNotField,
  legoEditorRequired,
  required,
} from '~/utils/validation';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { AutocompleteGroup } from '~/redux/models/Group';
import type { DetailedMeeting } from '~/redux/models/Meeting';
import type { AutocompleteUser } from '~/redux/models/User';

const time = (hours: number, minutes?: number) =>
  moment()
    .tz(appConfig.timezone)
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
  date?: [Dateish, Dateish];
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
  date: [
    dateRequired('Du må velge start- og sluttdato'),
    datesAreInCorrectOrder('Sluttidspunkt kan ikke være før starttidspunkt'),
  ],
  location: [
    ifNotField('useMazemap', required('Sted eller MazeMap-rom er påkrevd')),
  ],
  mazemapPoi: [
    ifField('useMazemap', required('Sted eller MazeMap-rom er påkrevd')),
  ],
});

type MeetingEditorParams = {
  meetingId?: string;
};
const MeetingEditor = () => {
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

  const onSubmit = (values) => {
    const formValues = {
      ...values,
      startTime: values.date[0],
      endTime: values.date[1],
    };
    delete formValues.date;

    return dispatch(
      isEditPage ? editMeeting(formValues) : createMeeting(formValues),
    ).then((result) => {
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
    });
  };

  const onDeleteMeeting = isEditPage
    ? () =>
        dispatch(deleteMeeting(meeting.id)).then(() => navigate('/meetings/'))
    : undefined;

  const actionGrant = meeting?.actionGrant;
  const canDelete = actionGrant?.includes('delete');

  const initialValues = isEditPage
    ? {
        ...meeting,
        date: [meeting.startTime, meeting.endTime],
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
        date: [time(16, 15), time(18)],
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
      <Helmet title={title}>{mazemapScript}</Helmet>
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
                required
                placeholder="Ny tittel for møte"
                component={TextInput.Field}
              />
              <Field
                name="report"
                label="Referat"
                required
                component={EditorField.Field}
              />
              <Field
                name="description"
                label="Kort beskrivelse"
                placeholder="Dette vises i kalenderen til de inviterte, så gjerne putt zoom-lenka her..."
                component={TextArea.Field}
              />
              <FormSpy subscription={{ values: true }}>
                {({ values }) => (
                  <Field
                    name="date"
                    label="Dato"
                    range
                    component={DatePicker.Field}
                    onBlur={(value: [Dateish, Dateish]) => {
                      const startTime = moment(value[0]);
                      const endTime = moment(values.date[1]);
                      if (endTime.isBefore(startTime)) {
                        form.change('date', [
                          startTime,
                          endTime.clone().add(2, 'hours').set('minute', 0),
                        ]);
                      }
                    }}
                  />
                )}
              </FormSpy>
              <Field
                label="Bruk MazeMap"
                name="useMazemap"
                type="checkbox"
                component={CheckBox.Field}
              />
              {spyValues<MeetingFormValues>((values) =>
                values?.useMazemap ? (
                  <Flex gap="var(--spacing-sm)">
                    <Field
                      label="Mazemap-rom"
                      required
                      name="mazemapPoi"
                      component={SelectInput.MazemapAutocomplete}
                      placeholder="R1, Abakus, Kjel4"
                    />
                    {values?.mazemapPoi?.value && (
                      <MazemapLink
                        mazemapPoi={values.mazemapPoi?.value}
                        iconOnly
                        style={{ position: 'relative', top: '0.8rem' }}
                      />
                    )}
                  </Flex>
                ) : (
                  <Field
                    name="location"
                    label="Sted"
                    required
                    placeholder="Sted for møte"
                    component={TextInput.Field}
                  />
                ),
              )}
              <RowSection>
                <Field
                  name="users"
                  filter={['users.user']}
                  label="Inviter brukere"
                  placeholder="Skriv inn brukernavn på de du vil invitere"
                  component={SelectInput.AutocompleteField}
                  isMulti
                />
                <Field
                  name="groups"
                  filter={['users.abakusgroup']}
                  label="Inviter grupper"
                  placeholder="Skriv inn gruppene du vil invitere"
                  component={SelectInput.AutocompleteField}
                  isMulti
                />
              </RowSection>

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
