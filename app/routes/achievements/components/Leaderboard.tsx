import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { fetchLeaderboardUsers } from 'app/actions/AchievementActions';
import { ContentMain } from 'app/components/Content';
import Table from 'app/components/Table';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectUsersWithAchievementsScore } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import { useIsMobileViewport } from 'app/utils/isMobileViewport';
import useQuery from 'app/utils/useQuery';
import type { ColumnProps } from 'app/components/Table';
import type { PublicUserWithAbakusGroups } from 'app/store/models/User';

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
        <Link to={`/users/${user.username}`}>
          {isMobile ? user.username : `${user.firstName} ${user.lastName}`}
        </Link>
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
