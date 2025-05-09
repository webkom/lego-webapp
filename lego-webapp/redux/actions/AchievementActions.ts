import { Achievement, User } from '~/redux/actionTypes';
import { userSchema } from '~/redux/schemas';
import callAPI from './callAPI';
import type { ParsedQs } from 'qs';
import type { PublicUser } from '~/redux/models/User';

export function fetchLeaderboardUsers({
  next = false,
  query,
}: {
  next: boolean;
  query: ParsedQs;
}) {
  return callAPI<PublicUser[]>({
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
    },
  });
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
