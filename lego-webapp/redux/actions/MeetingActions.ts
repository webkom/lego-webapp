import moment from 'moment-timezone';
import { Meeting } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { meetingSchema } from '~/redux/schemas';
import type { EntityId } from '@reduxjs/toolkit';
import type { MeetingFormValues } from '~/pages/meetings/MeetingEditor';
import type { DetailedMeeting, ListMeeting } from '~/redux/models/Meeting';
import type { MeetingInvitationStatus } from '~/redux/models/MeetingInvitation';
import type { CurrentUser } from '~/redux/models/User';

export function fetchMeeting(meetingId: string) {
  return callAPI<DetailedMeeting>({
    types: Meeting.FETCH,
    endpoint: `/meetings/${meetingId}/`,
    schema: meetingSchema,
    meta: {
      errorMessage: `Henting av møte ${meetingId} feilet`,
    },
    propagateError: true,
  });
}

export function fetchMeetingTemplates() {
  return callAPI<ListMeeting[]>({
    types: Meeting.FETCH_TEMPLATES,
    endpoint: '/meetings/templates/',
    schema: [meetingSchema],
    meta: {
      errorMessage: 'Henting av møter-maler feilet',
    },
    propagateError: true,
  });
}

export function fetchAll({
  query,
  next = false,
}: {
  query?: Record<string, string | undefined>;
  next?: boolean;
} = {}) {
  return callAPI<ListMeeting[]>({
    types: Meeting.FETCH,
    endpoint: '/meetings/',
    schema: [meetingSchema],
    query,
    pagination: {
      fetchNext: next,
    },
    meta: {
      errorMessage: 'Henting av møter feilet',
    },
    propagateError: true,
  });
}

export function setInvitationStatus(
  meetingId: EntityId,
  status: MeetingInvitationStatus,
  user: CurrentUser,
) {
  return callAPI<{ status: MeetingInvitationStatus }>({
    types: Meeting.SET_INVITATION_STATUS,
    endpoint: `/meetings/${meetingId}/invitations/${user.id}/`,
    method: 'PUT',
    body: {
      user: user.id,
      status,
    },
    meta: {
      errorMessage: 'Endring av invitasjonstatus feilet',
      meetingId,
      status,
      user,
    },
  });
}

export function deleteMeeting(id: EntityId) {
  return callAPI({
    types: Meeting.DELETE,
    endpoint: `/meetings/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av møte feilet',
    },
  });
}

export function createMeeting({
  title,
  report,
  location,
  startTime,
  description,
  endTime,
  reportAuthor,
  mazemapPoi,
  useMazemap,
  isRecurring,
  isTemplate,
}: MeetingFormValues) {
  return callAPI<DetailedMeeting>({
    types: Meeting.CREATE,
    endpoint: '/meetings/',
    method: 'POST',
    body: {
      title,
      report,
      description,
      location: calculateLocation(useMazemap, mazemapPoi, location),
      endTime: moment(endTime).toISOString(),
      startTime: moment(startTime).toISOString(),
      reportAuthor: reportAuthor && reportAuthor.id,
      mazemapPoi: calculateMazemapPoi(useMazemap, mazemapPoi),
      isRecurring: isRecurring,
      isTemplate: isTemplate,
    },
    schema: meetingSchema,
    meta: {
      errorMessage: 'Opprettelse av møte feilet',
    },
  });
}

export function inviteUsersAndGroups({
  id,
  users,
  groups,
}: {
  id: EntityId;
  users: [
    {
      id: EntityId;
    },
  ];
  groups: [
    {
      value: EntityId;
    },
  ];
}) {
  return callAPI<{ users: EntityId[]; groups: EntityId[] }>({
    types: Meeting.EDIT,
    endpoint: `/meetings/${id}/bulk_invite/`,
    method: 'POST',
    body: {
      users: users ? users.map((user) => user.id) : [],
      groups: groups ? groups.map((group) => group.value) : [],
    },
    meta: {
      errorMessage: 'Feil ved invitering av brukere/grupper',
    },
  });
}

export function answerMeetingInvitation(action: string, token: string) {
  return callAPI<unknown>({
    types: Meeting.ANSWER_INVITATION_TOKEN,
    endpoint: `/meeting-token/${action}/?token=${token}`,
    method: 'POST',
    meta: {
      errorMessage: 'Svar på invitasjon feilet',
    },
  });
}

export function editMeeting({
  title,
  report,
  location,
  startTime,
  description,
  endTime,
  reportAuthor,
  id,
  mazemapPoi,
  useMazemap,
  isRecurring,
  isTemplate,
}: MeetingFormValues) {
  return callAPI<DetailedMeeting>({
    types: Meeting.EDIT,
    endpoint: `/meetings/${id}/`,
    method: 'PUT',
    body: {
      title,
      id,
      report,
      location: calculateLocation(useMazemap, mazemapPoi, location),
      description,
      endTime: moment(endTime).toISOString(),
      startTime: moment(startTime).toISOString(),
      reportAuthor: reportAuthor && reportAuthor.id,
      mazemapPoi: calculateMazemapPoi(useMazemap, mazemapPoi),
      isRecurring: isRecurring,
      isTemplate: isTemplate,
    },
    schema: meetingSchema,
    meta: {
      errorMessage: 'Endring av møte feilet',
    },
  });
}

const calculateMazemapPoi = (
  useMazemap: boolean,
  mazemapPoi?: { value: number; label: string },
) => {
  if (!useMazemap || !mazemapPoi?.value) {
    return null;
  }

  return mazemapPoi.value;
};

const calculateLocation = (
  useMazemap: boolean,
  mazemapPoi?: { value: number; label: string },
  location?: string,
) => (useMazemap ? mazemapPoi?.label : location);
