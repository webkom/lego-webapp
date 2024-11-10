import { userSchema } from 'app/reducers';
import { User } from './ActionTypes';
import callAPI from './callAPI';
import type { PublicUser } from 'app/store/models/User';

export function fetchLeaderboardUsers() {
  return callAPI<PublicUser[]>({
    types: User.FETCH_LEADERBOARD,
    endpoint: `/achievements/leaderboard/`,
    schema: [userSchema],
    meta: {
      errorMessage: 'Henting av brukere feilet',
    },
  });
}
