import { userSchema } from 'app/reducers';
import { User } from './ActionTypes';
import callAPI from './callAPI';
import type { PublicUser } from 'app/store/models/User';

export function fetchLeaderboardUsers({ next = false }: { next: boolean }) {
  return callAPI<PublicUser[]>({
    types: User.FETCH_LEADERBOARD,
    endpoint: `/achievements/leaderboard/`,
    pagination: {
      fetchNext: next,
    },
    schema: [userSchema],
    method: 'GET',
    meta: {
      errorMessage: 'Henting av brukere feilet',
    },
  });
}
