import moment from 'moment-timezone';
import { startSubmit, stopSubmit } from 'redux-form';
import callAPI from 'app/actions/callAPI';
import { meetingSchema } from 'app/reducers';
import createQueryString from 'app/utils/createQueryString';
import { Meeting } from './ActionTypes';
import type { UserEntity } from 'app/reducers/users';
import type { MeetingFormValues } from 'app/routes/meetings/components/MeetingEditor';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type { DetailedMeeting, ListMeeting } from 'app/store/models/Meeting';
import type { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import type { GetState } from 'app/types';

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

const getEndpoint = (
  state: RootState,
  loadNextPage: boolean | undefined,
  queryString: string
) => {
  const pagination = state.meetings.pagination;
  let endpoint = `/meetings/${queryString}`;
  const paginationObject = pagination[queryString];

  if (
    loadNextPage &&
    paginationObject &&
    paginationObject.queryString === queryString
  ) {
    endpoint = pagination[queryString].nextPage;
  }

  return endpoint;
};

export function fetchAll({
  dateAfter,
  dateBefore,
  ordering,
  loadNextPage,
}: {
  dateAfter?: string;
  dateBefore?: string;
  ordering?: string;
  refresh?: boolean;
  loadNextPage?: boolean;
} = {}) {
  return (dispatch: AppDispatch, getState: GetState) => {
    const query: Record<string, string | undefined> = {
      date_after: dateAfter,
      date_before: dateBefore,
      ordering,
    };

    if (dateBefore && dateAfter) {
      query.page_size = '60';
    }

    const queryString = createQueryString(query);
    const endpoint = getEndpoint(getState(), loadNextPage, queryString);

    if (!endpoint) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI<ListMeeting>({
        types: Meeting.FETCH,
        endpoint,
        schema: [meetingSchema],
        meta: {
          queryString,
          errorMessage: 'Henting av møter feilet',
        },
        propagateError: true,
      })
    );
  };
}
export function setInvitationStatus(
  meetingId: number,
  status: string,
  user: UserEntity
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
export function deleteMeeting(id: number) {
  return callAPI<void>({
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
}) {
  return callAPI<{ users: ID[]; groups: ID[] }>({
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
  return (dispatch: AppDispatch) => {
    dispatch(startSubmit('answerMeetingInvitation'));
    return dispatch(
      callAPI<unknown>({
        types: Meeting.ANSWER_INVITATION_TOKEN,
        endpoint: `/meeting-token/${action}/?token=${token}`,
        method: 'POST',
        meta: {
          errorMessage: 'Svar på invitasjon feilet',
        },
      })
    )
      .then(() => {
        dispatch(stopSubmit('answerMeetingInvitation'));
      })
      .catch(() => {
        dispatch(stopSubmit('answerMeetingInvitation', null));
      });
  };
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
    },
    schema: meetingSchema,
    meta: {
      errorMessage: 'Endring av møte feilet',
    },
  });
}
export function resetMeetingsToken() {
  return {
    type: Meeting.RESET_MEETINGS_TOKEN,
  };
}

const calculateMazemapPoi = (
  useMazemap: boolean,
  mazemapPoi?: { value: number; label: string }
) => {
  if (!useMazemap || !mazemapPoi?.value) {
    return null;
  }

  return mazemapPoi.value;
};

const calculateLocation = (
  useMazemap: boolean,
  mazemapPoi?: { value: number; label: string },
  location?: string
) => (useMazemap ? mazemapPoi?.label : location);
