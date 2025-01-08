import { usePreparedEffect } from '@webkom/react-prepare';
import { Link } from 'react-router-dom';
import { fetchLeaderboardUsers } from 'app/actions/AchievementActions';
import { ContentMain } from 'app/components/Content';
import Table from 'app/components/Table';
import { selectUsersWithAchievementsScore } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { ColumnProps } from 'app/components/Table';
import type { PublicUser } from 'app/store/models/User';

type RankedUser = PublicUser & {
  rank: number;
};

const Leaderboard = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchLeaderboardUsers',
    () => {
      dispatch(fetchLeaderboardUsers());
    },
    [dispatch],
  );
  const users = useAppSelector((state) =>
    selectUsersWithAchievementsScore(state),
  );
  const fetching = useAppSelector((state) => state.users.fetchingAchievements);
  const rankedUsers: RankedUser[] = users
    .slice()
    .sort((a, b) => b.achievementsScore - a.achievementsScore)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

  const columns: ColumnProps<RankedUser>[] = [
    {
      title: 'Rangering',
      dataIndex: 'rank',
      search: false,
      render: (_, user: RankedUser) => <>{user.rank}</>,
    },
    {
      title: 'Navn',
      dataIndex: 'name',
      search: false,
      inlineFiltering: false,
      render: (_, user: RankedUser) => (
        <Link to={`/users/${user.username}`}>{user.username}</Link>
      ),
    },
    {
      title: 'Fullføringsprosent',
      dataIndex: 'score',
      search: false,
      inlineFiltering: false,
      render: (_, user: RankedUser) => <>{user.achievementsScore}%</>,
      sorter: (a: RankedUser, b: RankedUser) =>
        b.achievementsScore - a.achievementsScore,
    },
  ];

  return (
    <ContentMain>
      <Table
        columns={columns}
        data={rankedUsers}
        loading={fetching}
        hasMore={false}
      />
    </ContentMain>
  );
};

export default Leaderboard;
