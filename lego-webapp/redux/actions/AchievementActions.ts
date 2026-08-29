import { Achievement, User } from '~/redux/actionTypes';
import { userSchema } from '~/redux/schemas';
import callAPI from './callAPI';
import type { ParsedQs } from 'qs';
import type { RankType } from '~/pages/achievements/utils';
import type { PublicUser } from '~/redux/models/User';
import type { AchievementIdentifier } from '~/utils/achievementConstants';

export type RankHistoryPoint = {
  date: string;
  rank: number;
  value: number;
};

export type ScoreDistributionBin = {
  min: number;
  max: number;
  count: number;
};

export type ScoreDistribution = {
  bins: ScoreDistributionBin[];
  totalCount: number;
  yourValue: number | null;
  percentile: number | null;
};

export type AchievementRarity = {
  identifier: AchievementIdentifier;
  level: number;
  percentage: number;
};

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

export function fetchRankHistory({ type }: { type: RankType }) {
  return callAPI<RankHistoryPoint[]>({
    types: Achievement.FETCH_RANK_HISTORY,
    endpoint: `/achievements/leaderboard/rank_history/`,
    query: { type },
    method: 'GET',
    meta: {
      errorMessage: 'Henting av rangeringshistorikk feilet',
    },
  });
}

export function fetchScoreDistribution({ type }: { type: RankType }) {
  return callAPI<ScoreDistribution>({
    types: Achievement.FETCH_DISTRIBUTION,
    endpoint: `/achievements/leaderboard/distribution/`,
    query: { type },
    method: 'GET',
    meta: {
      errorMessage: 'Henting av poengfordeling feilet',
    },
  });
}

export function fetchAchievementRarity() {
  return callAPI<AchievementRarity[]>({
    types: Achievement.FETCH_RARITY,
    endpoint: `/achievements/rarity/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av trofé-sjeldenhet feilet',
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
