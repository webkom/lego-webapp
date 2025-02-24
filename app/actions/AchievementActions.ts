import { userSchema } from 'app/reducers';
import { Achievement, User } from './ActionTypes';
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

export function postGettingWood() {
  return callAPI({
    endpoint: `/achievements/getting_wood/`,
    method: 'POST',
    types: Achievement.CREATE,
    meta: {
      errorMessage: 'Oppretting av trofé feilet.',
      successMessage: 'Trofé oppnådd: "Skaffe tre"',
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
      errorMessage: 'Oppretting av trofé feilet.',
      successMessage: 'Trofé oppnådd: "Powermode activated!"',
    },
  });
}
