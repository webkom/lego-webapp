import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { fetchLeaderboardUsers } from 'app/actions/AchievementActions';
import { ContentMain } from 'app/components/Content';
import Table from 'app/components/Table';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectUsersWithAchievementsScore } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import useQuery from 'app/utils/useQuery';
import type { ColumnProps } from 'app/components/Table';
import type { PublicUser } from 'app/store/models/User';

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
    }, 1000);

    return () => clearTimeout(timer);
  }, [leaderboardQuery.userFullName]);

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/achievements/leaderboard/',
      entity: EntityType.Users,
      query: leaderboardQuery || {},
    })(state),
  );

  usePreparedEffect(
    'fetchLeaderboardUsers',
    () => {
      dispatch(
        fetchLeaderboardUsers({
          next: true,
          query: { ...leaderboardQuery, userFullName: debouncedSearch },
        }),
      );
    },
    [dispatch, debouncedSearch, leaderboardQuery.abakusGroupIds],
  );
  const users = useAppSelector((state) =>
    selectUsersWithAchievementsScore(state),
  );
  const rankedUsers: PublicUser[] = users
    .slice()
    .sort((a, b) => a.achievementRank - b.achievementRank)
    .map((user) => ({
      ...user,
    }));

  const columns: ColumnProps<PublicUser>[] = [
    {
      title: 'Rangering',
      dataIndex: 'rank',
      search: false,
      render: (_, user: PublicUser) => <>{user.achievementRank}</>,
    },
    {
      title: 'Navn',
      dataIndex: 'name',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUser) => (
        <Link to={`/users/${user.username}`}>
          {user.firstName} {user.lastName} ({user.username})
        </Link>
      ),
    },
    {
      title: 'Fullføringsprosent',
      dataIndex: 'score',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUser) => <>{user.achievementsScore}%</>,
      sorter: (a: PublicUser, b: PublicUser) =>
        a.achievementRank - b.achievementRank,
    },
  ];

  return (
    <ContentMain>
      <Table
        columns={columns}
        data={rankedUsers}
        loading={pagination.fetching}
        hasMore={pagination.hasMore}
        onLoad={() => {
          dispatch(
            fetchLeaderboardUsers({
              next: true,
              query: { ...leaderboardQuery, userFullName: debouncedSearch },
            }),
          );
        }}
      />
    </ContentMain>
  );
};

export default Leaderboard;
