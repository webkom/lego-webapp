import { Achievement, User } from '~/redux/actionTypes';
import { userSchema } from '~/redux/schemas';
import callAPI from './callAPI';
import type { APIPromiseResult } from './callAPI';
import type { ParsedQs } from 'qs';
import type { PublicUser } from '~/redux/models/User';

export function fetchLeaderboardUsers({
  next = false,
  query,
}: {
  next: boolean;
  query: ParsedQs;
}): APIPromiseResult<PublicUser[]> {
  return (dispatch, getState) => {
    // Claim the next requestId so a response that resolves after a newer
    // leaderboard fetch has already started (e.g. rapidly switching rank
    // type) can be recognized as stale and discarded, see users.ts.
    const requestId = getState().users.leaderboardRequestId + 1;

    return dispatch(
      callAPI<PublicUser[]>({
        types: User.FETCH_LEADERBOARD,
        endpoint: `/achievements/leaderboard/`,
        query,
        pagination: {
          fetchNext: next,
        },
        schema: [userSchema],
        method: 'GET',
        meta: {
          errorMessage: 'Henting av brukere feilet',
          requestId,
        },
        discardResultIf: () =>
          getState().users.leaderboardRequestId !== requestId,
      }),
    );
  };
}
export function postGettingWood() {
  return callAPI({
    endpoint: `/achievements/getting_wood/`,
    method: 'POST',
    types: Achievement.CREATE,
    meta: {
      successMessage: 'Trofe oppnådd: "Skaffe tre"',
    },
  });
}

export function postKeypress({ code }: { code: number[] }) {
  return callAPI({
    endpoint: `/achievements/keypress_order/`,
    method: 'POST',
    body: { code },
    types: Achievement.CREATE,
    meta: {
      successMessage: 'Trofe oppnådd: "Powermode activated!"',
    },
  });
}

export function triggerAchievementRecheck() {
  return callAPI({
    endpoint: `/achievements/recheck_all/`,
    types: Achievement.RECHECK,
    meta: {
      errorMessage: 'Sjekking av trofeer feilet.',
      successMessage: 'Sjekking af trofeer fullført.',
    },
  });
}
