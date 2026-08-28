import { LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect, useMemo, useState } from 'react';
import { ContentMain } from '~/components/Content';
import Table from '~/components/Table';
import { fetchLeaderboardUsers } from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { selectUsersWithAchievementsScore } from '~/redux/slices/users';
import { useIsMobileViewport } from '~/utils/isMobileViewport';
import useQuery from '~/utils/useQuery';
import type { ColumnProps } from '~/components/Table';
import type { PublicUserWithAbakusGroups } from '~/redux/models/User';

export type RankType = 'achievement_score' | 'event_count';

export const RANK_TYPE_PATHS: Record<RankType, string> = {
  achievement_score: '/achievements/leaderboard',
  event_count: '/achievements/leaderboard/event-count',
};

const RANK_TYPE_LABELS: Record<RankType, string> = {
  achievement_score: 'Score',
  event_count: 'Arrangementer',
};

const RankChange = ({
  current,
  previous,
}: {
  current: number;
  previous: number | null;
}) => {
  if (previous === null) {
    return <span aria-label="Ingen historikk enda">-</span>;
  }

  const diff = previous - current;

  if (diff === 0) {
    return <span aria-label="Ingen endring"> =</span>;
  }

  if (diff > 0) {
    return (
      <span
        style={{ color: 'var(--color-green-7)' }}
        aria-label={`Opp ${diff} plasser`}
      >
        ↑ {diff}
      </span>
    );
  }

  return (
    <span
      style={{ color: 'var(--color-red-7)' }}
      aria-label={`Ned ${Math.abs(diff)} plasser`}
    >
      ↓ {Math.abs(diff)}
    </span>
  );
};

type Props = {
  type: RankType;
};

const LeaderboardTable = ({ type }: Props) => {
  const dispatch = useAppDispatch();

  const { query: leaderboardQuery } = useQuery({
    userFullName: '',
    abakusGroupIds: '',
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(leaderboardQuery.userFullName);
    }, 300);

    return () => clearTimeout(timer);
  }, [leaderboardQuery.userFullName]);

  const memoizedQuery = useMemo(
    () => ({
      userFullName: debouncedSearch,
      abakusGroupIds: leaderboardQuery.abakusGroupIds,
      type,
    }),
    [debouncedSearch, leaderboardQuery.abakusGroupIds, type],
  );

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/achievements/leaderboard/',
      entity: EntityType.Users,
      query: memoizedQuery || {},
    })(state),
  );

  usePreparedEffect(
    'fetchLeaderboardUsers',
    () => {
      dispatch(
        fetchLeaderboardUsers({
          next: true,
          query: memoizedQuery,
        }),
      );
    },
    [dispatch, memoizedQuery],
  );

  const users = useAppSelector((state) =>
    selectUsersWithAchievementsScore(state),
  );

  const rankedUsers: PublicUserWithAbakusGroups[] = users
    .filter((user: PublicUserWithAbakusGroups) => {
      if (leaderboardQuery.userFullName) {
        const search = leaderboardQuery.userFullName.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (!fullName.includes(search)) {
          return false;
        }
      }
      if (leaderboardQuery.abakusGroupIds) {
        const groupIds = leaderboardQuery.abakusGroupIds
          .split(',')
          .map((id) => Number(id.trim()));
        if (!groupIds.some((id) => user.abakusGroups.includes(id))) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => a.achievementRank - b.achievementRank);

  const isMobile = useIsMobileViewport();
  const isEventCountType = type === 'event_count';

  const columns: ColumnProps<PublicUserWithAbakusGroups>[] = [
    {
      title: 'Rangering',
      dataIndex: 'rank',
      search: false,
      render: (_, user: PublicUserWithAbakusGroups) => (
        <>{user.achievementRank}</>
      ),
    },
    {
      title: 'Navn',
      dataIndex: 'fullName',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUserWithAbakusGroups) => (
        <a href={`/users/${user.username}`}>
          {isMobile ? user.username : `${user.firstName} ${user.lastName}`}
        </a>
      ),
    },
    ...(!isEventCountType
      ? [
          {
            title: 'Fullføringsprosent',
            dataIndex: 'score',
            search: false,
            inlineFiltering: false,
            render: (_, user: PublicUserWithAbakusGroups) => (
              <>{user.achievementsScore}%</>
            ),
          } as ColumnProps<PublicUserWithAbakusGroups>,
        ]
      : [
          {
            title: 'Antall',
            dataIndex: 'eventCount',
            search: false,
            inlineFiltering: false,
            render: (_, user: PublicUserWithAbakusGroups) => (
              <>{user.eventCount ?? 0}</>
            ),
          } as ColumnProps<PublicUserWithAbakusGroups>,
        ]),
    {
      title: 'Siste uke',
      dataIndex: 'rankWeekAgo',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUserWithAbakusGroups) => (
        <RankChange
          current={user.achievementRank}
          previous={user.rankWeekAgo}
        />
      ),
    },
    {
      title: 'Siste måned',
      dataIndex: 'rankMonthAgo',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUserWithAbakusGroups) => (
        <RankChange
          current={user.achievementRank}
          previous={user.rankMonthAgo}
        />
      ),
    },
  ];

  return (
    <ContentMain>
      <div
        role="group"
        aria-label="Velg rangeringstype"
        style={{ display: 'flex', gap: 8, marginBottom: 16 }}
      >
        {(Object.keys(RANK_TYPE_LABELS) as RankType[]).map((rankType) => (
          <LinkButton
            key={rankType}
            aria-pressed={type === rankType}
            disabled={type === rankType}
            href={RANK_TYPE_PATHS[rankType]}
          >
            {RANK_TYPE_LABELS[rankType]}
          </LinkButton>
        ))}
      </div>

      <Table
        columns={columns}
        data={rankedUsers}
        loading={pagination.fetching}
        hasMore={pagination.hasMore}
        filters={leaderboardQuery}
        onLoad={() => {
          dispatch(
            fetchLeaderboardUsers({
              next: true,
              query: memoizedQuery,
            }),
          );
        }}
      />
    </ContentMain>
  );
};

export default LeaderboardTable;
