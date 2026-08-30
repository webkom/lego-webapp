import { Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ContentMain } from '~/components/Content';
import Table from '~/components/Table';
import { RankTypeToggle } from '~/pages/achievements/utils';
import { fetchLeaderboardUsers } from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { selectUsersWithAchievementsScore } from '~/redux/slices/users';
import { rarityMap } from '~/utils/achievementConstants';
import { useIsMobileViewport } from '~/utils/isMobileViewport';
import useQuery from '~/utils/useQuery';
import type { ColumnProps } from '~/components/Table';
import type { RankType } from '~/pages/achievements/utils';
import type { PublicUserWithAbakusGroups } from '~/redux/models/User';

// Reuses the app's existing bronze/silver/gold rarity-tier colors so a top-3
// placement reads as "medal" without inventing a new color language.
const PODIUM_COLORS: Record<number, string> = {
  1: rarityMap[2].color,
  2: rarityMap[1].color,
  3: rarityMap[0].color,
};

const RankBadge = ({ rank }: { rank: number | null }) => {
  const podiumColor = rank !== null ? PODIUM_COLORS[rank] : undefined;

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      gap="var(--spacing-xs)"
    >
      <Trophy
        size={14}
        color={podiumColor}
        aria-hidden
        style={{ visibility: podiumColor ? 'visible' : 'hidden' }}
      />
      <span
        style={podiumColor ? { color: podiumColor, fontWeight: 600 } : undefined}
      >
        {rank ?? '-'}
      </span>
    </Flex>
  );
};

const RankChange = ({
  current,
  previous,
}: {
  current: number | null;
  previous: number | null;
}) => {
  if (current === null || previous === null) {
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
    .sort((a, b) =>
      type === 'event_count'
        ? (b.eventCount?.value ?? 0) - (a.eventCount?.value ?? 0)
        : (b.achievementScore.value ?? 0) - (a.achievementScore.value ?? 0),
    );

  const isMobile = useIsMobileViewport();
  const isEventCountType = type === 'event_count';

  const getRankScore = (user: PublicUserWithAbakusGroups) =>
    isEventCountType ? user.eventCount : user.achievementScore;

  const columns: ColumnProps<PublicUserWithAbakusGroups>[] = [
    {
      title: 'Rangering',
      dataIndex: 'rank',
      search: false,
      render: (_, user: PublicUserWithAbakusGroups) => (
        <RankBadge rank={getRankScore(user)?.rank ?? null} />
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
              <>{user.achievementScore.value}%</>
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
              <>{user.eventCount?.value ?? 0}</>
            ),
          } as ColumnProps<PublicUserWithAbakusGroups>,
        ]),
    {
      title: 'Siste uke',
      dataIndex: 'rankWeekAgo',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUserWithAbakusGroups) => {
        const score = getRankScore(user);
        return (
          <RankChange
            current={score?.rank ?? null}
            previous={score?.rankWeekAgo ?? null}
          />
        );
      },
    },
    {
      title: 'Siste måned',
      dataIndex: 'rankMonthAgo',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUserWithAbakusGroups) => {
        const score = getRankScore(user);
        return (
          <RankChange
            current={score?.rank ?? null}
            previous={score?.rankMonthAgo ?? null}
          />
        );
      },
    },
  ];

  return (
    <ContentMain>
      <RankTypeToggle type={type} basePath="/achievements/leaderboard" />

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
