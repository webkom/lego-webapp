import {
  ButtonGroup,
  ConfirmModal,
  Flex,
  Icon,
  LoadingPage,
  Page,
  Tooltip,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { unionBy } from 'lodash-es';
import { Trash2 } from 'lucide-react';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field, FormSpy } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import Dropdown from '~/components/Dropdown';
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
import { mazemapDeps } from '~/components/MazemapEmbed';
import MazemapLink from '~/components/MazemapEmbed/MazemapLink';
import Attendance from '~/components/UserAttendance/Attendance';
import { fetchMemberships } from '~/redux/actions/GroupActions';
import {
  createMeeting,
  deleteMeeting,
  editMeeting,
  fetchMeeting,
  fetchMeetingTemplates,
  inviteUsersAndGroups,
} from '~/redux/actions/MeetingActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectMeetingInvitationsForMeeting } from '~/redux/slices/meetingInvitations';
import {
  selectMeetingById,
  selectMyMeetingTemplates,
  useFetchedMeetingTemplate,
} from '~/redux/slices/meetings';
import { selectUserById, selectUsersByIds } from '~/redux/slices/users';
import { appConfig } from '~/utils/appConfig';
import { EDITOR_EMPTY } from '~/utils/constants';
import { spyValues } from '~/utils/formSpyUtils';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import useQuery from '~/utils/useQuery';
import {
  createValidator,
  datesAreInCorrectOrder,
  dateRequired,
  ifField,
  ifNotField,
  legoEditorRequired,
  required,
} from '~/utils/validation';
import styles from './MeetingEditor.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { AutocompleteGroup } from '~/redux/models/Group';
import type { DetailedMeeting } from '~/redux/models/Meeting';
import type { AutocompleteUser, PublicUser } from '~/redux/models/User';

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
  isRecurring: boolean;
  isTemplate?: boolean;
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

  usePreparedEffect(
    'fetchMeetingTemplates',
    () => dispatch(fetchMeetingTemplates()),
    [],
  );

  const defaultEditMeetingQuery = {
    templateId: '',
  };

  const { query, setQueryValue } = useQuery(defaultEditMeetingQuery);

  const myTemplates = useAppSelector(selectMyMeetingTemplates);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const template = useFetchedMeetingTemplate('createMeeting', query.templateId);
  const templateInvitees = useAppSelector((state) =>
    selectUsersByIds(
      state,
      template?.invitations.map((e) => e.toString().split('-')[1]),
    ),
  ) as PublicUser[]; // I have no idea why invitees is stored like this dont ask me
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

  let initialValues;
  if (template) {
    initialValues = {
      ...template,
      date: [template?.startTime, template?.endTime],
      reportAuthor: reportAuthor && {
        id: reportAuthor.id,
        value: reportAuthor.username,
        label: reportAuthor.fullName,
      },
      report: template.report ?? '',
      description: template.description ?? '',
      mazemapPoi: template.mazemapPoi && {
        label: template.location,
        value: template.mazemapPoi,
      },
      useMazemap: template.mazemapPoi !== undefined && template.mazemapPoi > 0,
      isTemplate: false,
      isRecurring: false,
      users: templateInvitees.map((user) => {
        return { label: user.username, value: user.id, id: user.id };
      }),
    };
  } else if (isEditPage) {
    initialValues = {
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
    };
  } else {
    initialValues = {
      date: [time(16, 15), time(18)],
      report: EDITOR_EMPTY,
      useMazemap: true,
      isTemplate: false,
    };
  }

  const title = isEditPage
    ? meeting?.isTemplate
      ? `Redigerer malen: ${meeting.title}`
      : `Redigerer: ${meeting?.title}`
    : 'Nytt møte';

  return (
    <Page
      title={title}
      skeleton={fetching}
      back={{
        label: `${isEditPage ? 'Tilbake' : 'Dine møter'}`,
        href: `/meetings/${isEditPage ? meetingId : ''}`,
      }}
    >
      <Helmet title={title}>{mazemapDeps}</Helmet>
      <LegoFinalForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        subscription={{}}
        key={query.templateId}
      >
        {({ handleSubmit, form }) => {
          return (
            <Form onSubmit={handleSubmit}>
              {myTemplates.length > 0 && (
                <div className={styles.templatePicker}>
                  <ConfirmModal
                    title="Bekreft bruk av mal"
                    message={
                      'Dette vil slette alle ulagrede endringer i møtet!\n' +
                      'Lagrede endringer vil ikke overskrives før du trykker "Lagre".'
                    }
                    closeOnConfirm
                    onCancel={async () => setTemplatePickerOpen(false)}
                    onConfirm={async () => setTemplatePickerOpen(true)}
                  >
                    {({ openConfirmModal }) => (
                      <Button onPress={openConfirmModal}>
                        {query.templateId ? 'Bytt mal' : 'Bruk mal'}
                      </Button>
                    )}
                  </ConfirmModal>
                  <Dropdown
                    className={styles.templateDropdown}
                    show={templatePickerOpen}
                    toggle={() => setTemplatePickerOpen(false)}
                    closeOnContentClick
                  >
                    <Dropdown.List>
                      {myTemplates.map((template) => {
                        return (
                          <Dropdown.ListItem key={template.id}>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQueryValue('templateId')(
                                  template.id.toString(),
                                );
                              }}
                            >
                              {template.title}
                            </a>
                          </Dropdown.ListItem>
                        );
                      })}
                    </Dropdown.List>
                  </Dropdown>
                </div>
              )}
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
              {(!isEditPage || (isEditPage && initialValues.isTemplate)) && (
                <Field
                  name="isTemplate"
                  label="Lagre som mal"
                  component={CheckBox.Field}
                  type="checkbox"
                />
              )}
              {(!isEditPage || (isEditPage && initialValues.isTemplate)) && (
                <Tooltip
                  content="Ukentlige møter generer kun møter fra starttidspunktet til malen"
                  positions={'left'}
                >
                  <Field
                    name="isRecurring"
                    label="Ukentlig møte"
                    component={CheckBox.Field}
                    type="checkbox"
                  />
                </Tooltip>
              )}

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
