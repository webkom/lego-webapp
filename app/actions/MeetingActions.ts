import moment from 'moment-timezone';
import { startSubmit, stopSubmit } from 'redux-form';
import callAPI from 'app/actions/callAPI';
import { meetingSchema } from 'app/reducers';
import type { UserEntity } from 'app/reducers/users';
import type { ID } from 'app/store/models';
import type { Thunk, Action } from 'app/types';
import createQueryString from 'app/utils/createQueryString';
import { Meeting } from './ActionTypes';

export function fetchMeeting(meetingId: string): Thunk<any> {
  return callAPI({
    types: Meeting.FETCH,
    endpoint: `/meetings/${meetingId}/`,
    schema: meetingSchema,
    meta: {
      errorMessage: `Henting av møte ${meetingId} feilet`,
    },
    propagateError: true,
  });
}

const getEndpoint = (state, loadNextPage, queryString) => {
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
} = {}): Thunk<any> {
  return (dispatch, getState) => {
    const query: Record<string, any> = {
      date_after: dateAfter,
      date_before: dateBefore,
      ordering,
    };

    if (dateBefore && dateAfter) {
      query.page_size = 60;
    }

    const queryString = createQueryString(query);
    const endpoint = getEndpoint(getState(), loadNextPage, queryString);

    if (!endpoint) {
      return Promise.resolve(null);
    }

    return dispatch(
      callAPI({
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
): Thunk<any> {
  return callAPI({
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
export function deleteMeeting(id: number): Thunk<any> {
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
}: Record<string, any>): Thunk<any> {
  return callAPI({
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
}): Thunk<Promise<void>> {
  return callAPI({
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
export function answerMeetingInvitation(
  action: string,
  token: string
): Thunk<Promise<void>> {
  return (dispatch) => {
    dispatch(startSubmit('answerMeetingInvitation'));
    return dispatch(
      callAPI({
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
}: Record<string, any>): Thunk<any> {
  return callAPI({
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
export function resetMeetingsToken(): Action {
  return {
    type: Meeting.RESET_MEETINGS_TOKEN,
  };
}

const calculateMazemapPoi = (useMazemap, mazemapPoi) => {
  if (!useMazemap || !mazemapPoi.value) {
    return null;
  }

  return mazemapPoi.value;
};

const calculateLocation = (useMazemap, mazemapPoi, location) =>
  useMazemap ? mazemapPoi.label : location;
