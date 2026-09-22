import { Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ContentMain } from '~/components/Content';
import Table from '~/components/Table';
import {
  PopulationToggle,
  RankChange,
  RankTypeToggle,
  rankingKey,
  toRankType,
} from '~/pages/achievements/utils';
import { fetchLeaderboardUsers } from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { selectUsersRankedBy } from '~/redux/slices/users';
import { rarityMap } from '~/utils/achievementConstants';
import { useIsMobileViewport } from '~/utils/isMobileViewport';
import useQuery from '~/utils/useQuery';
import type { ColumnProps } from '~/components/Table';
import type { Metric, Population } from '~/pages/achievements/utils';
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
    <Flex alignItems="center" justifyContent="center" gap="var(--spacing-xs)">
      <Trophy
        size={14}
        color={podiumColor}
        aria-hidden
        style={{ visibility: podiumColor ? 'visible' : 'hidden' }}
      />
      <span
        style={
          podiumColor ? { color: podiumColor, fontWeight: 600 } : undefined
        }
      >
        {rank ?? '-'}
      </span>
    </Flex>
  );
};

const parseGroupIds = (csv: string): number[] =>
  csv ? csv.split(',').map((id) => Number(id.trim())) : [];

const matchesGroupFilter = (
  user: PublicUserWithAbakusGroups,
  groupIds: number[],
) =>
  groupIds.length === 0 ||
  groupIds.some((id) => user.abakusGroups.includes(id));

type Props = {
  metric: Metric;
};

const LeaderboardTable = ({ metric }: Props) => {
  const dispatch = useAppDispatch();

  const { query: leaderboardQuery, setQueryValue } = useQuery({
    userFullName: '',
    abakusGroupIds: '',
    programGroupIds: '',
    population: 'active' as Population,
  });
  const population = leaderboardQuery.population;
  const rankType = toRankType(metric, population);
  const key = rankingKey(metric, population);

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
      programGroupIds: leaderboardQuery.programGroupIds,
      type: rankType,
    }),
    [
      debouncedSearch,
      leaderboardQuery.abakusGroupIds,
      leaderboardQuery.programGroupIds,
      rankType,
    ],
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

  const users = useAppSelector((state) => selectUsersRankedBy(state, key));

  const rankedUsers: PublicUserWithAbakusGroups[] = useMemo(() => {
    const search = leaderboardQuery.userFullName.toLowerCase();
    const groupIds = parseGroupIds(leaderboardQuery.abakusGroupIds);
    const programIds = parseGroupIds(leaderboardQuery.programGroupIds);

    return users
      .filter((user) => {
        if (search) {
          const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
          if (!fullName.includes(search)) return false;
        }
        if (!matchesGroupFilter(user, groupIds)) return false;
        if (!matchesGroupFilter(user, programIds)) return false;
        return true;
      })
      .sort(
        (a, b) => (b.ranking[key]?.value ?? 0) - (a.ranking[key]?.value ?? 0),
      );
  }, [
    users,
    leaderboardQuery.userFullName,
    leaderboardQuery.abakusGroupIds,
    leaderboardQuery.programGroupIds,
    key,
  ]);

  const isMobile = useIsMobileViewport();
  const isEventCountType = metric === 'event_count';

  const getRankScore = (user: PublicUserWithAbakusGroups) => user.ranking[key];

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
              <>{user.ranking[key]?.value}%</>
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
              <>{user.ranking[key]?.value ?? 0}</>
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
      <Flex justifyContent="space-between" wrap gap="var(--spacing-md)">
        <RankTypeToggle metric={metric} basePath="/achievements/leaderboard" />
        <PopulationToggle
          population={population}
          onChange={setQueryValue('population')}
        />
      </Flex>

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
