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

const Leaderboard = () => {
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
    }),
    [debouncedSearch, leaderboardQuery.abakusGroupIds],
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

  const columns: ColumnProps<PublicUserWithAbakusGroups>[] = [
    {
      title: 'Rangering',
      dataIndex: 'rank',
      search: false,
      render: (_, user: PublicUserWithAbakusGroups) => (
        <>{user.achievementRank}</>
      ),
      sorter: (a: PublicUserWithAbakusGroups, b: PublicUserWithAbakusGroups) =>
        a.achievementRank - b.achievementRank,
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
    {
      title: 'Fullføringsprosent',
      dataIndex: 'score',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUserWithAbakusGroups) => (
        <>{user.achievementsScore}%</>
      ),
      sorter: (a: PublicUserWithAbakusGroups, b: PublicUserWithAbakusGroups) =>
        b.achievementsScore - a.achievementsScore,
    },
  ];

  return (
    <ContentMain>
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

export default Leaderboard;
