import { Achievement, User } from '~/redux/actionTypes';
import { userSchema } from '~/redux/schemas';
import callAPI from './callAPI';
import type { EntityId } from '@reduxjs/toolkit';
import type { ParsedQs } from 'qs';
import type { RankType } from '~/pages/achievements/utils';
import type {
  Achievement as AchievementModel,
  PublicUser,
} from '~/redux/models/User';
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

export type TopClimber = {
  username: string;
  fullName: string;
  rank: number;
  rankWeekAgo: number;
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

export function fetchTopClimbers({ type }: { type: RankType }) {
  return callAPI<TopClimber[]>({
    types: Achievement.FETCH_TOP_CLIMBERS,
    endpoint: `/achievements/leaderboard/top_climbers/`,
    query: { type },
    method: 'GET',
    meta: {
      errorMessage: 'Henting av toppklatrere feilet',
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

export function fetchUserAchievements(userId: EntityId) {
  return callAPI<AchievementModel[]>({
    endpoint: `/achievements/user_achievements/`,
    query: { user_id: String(userId) },
    types: Achievement.FETCH_USER_ACHIEVEMENTS,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av brukerens trofeer feilet',
    },
  });
}

export function grantAchievement({
  userId,
  identifier,
  level,
  reason,
}: {
  userId: EntityId;
  identifier: AchievementIdentifier;
  level: number;
  reason: string;
}) {
  return callAPI<AchievementModel>({
    endpoint: `/achievements/grant/`,
    method: 'POST',
    body: { user_id: userId, identifier, level, reason },
    types: Achievement.GRANT,
    meta: {
      errorMessage: 'Tildeling av trofé feilet',
      successMessage: 'Trofé tildelt',
    },
  });
}

export function revokeAchievement({
  userId,
  identifier,
  reason,
}: {
  userId: EntityId;
  identifier: AchievementIdentifier;
  reason: string;
}) {
  return callAPI({
    endpoint: `/achievements/revoke/`,
    method: 'POST',
    body: { user_id: userId, identifier, reason },
    types: Achievement.REVOKE,
    meta: {
      errorMessage: 'Fjerning av trofé feilet',
      successMessage: 'Trofé fjernet',
    },
  });
}

export function grantAchievementBulk({
  userIds,
  identifier,
  level,
  reason,
}: {
  userIds: EntityId[];
  identifier: AchievementIdentifier;
  level: number;
  reason: string;
}) {
  return callAPI({
    endpoint: `/achievements/grant_bulk/`,
    method: 'POST',
    body: { user_ids: userIds, identifier, level, reason },
    types: Achievement.GRANT_BULK,
    meta: {
      errorMessage: 'Massetildeling av trofé feilet',
      successMessage: 'Trofé tildelt til alle valgte brukere',
    },
  });
}
