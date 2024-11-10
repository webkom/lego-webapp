import { usePreparedEffect } from '@webkom/react-prepare';
import { Link } from 'react-router-dom';
import { fetchLeaderboardUsers } from 'app/actions/AchievementActions';
import Table from 'app/components/Table';
import { selectUsersWithAchievementScore } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { PublicUser } from 'app/store/models/User';

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
    selectUsersWithAchievementScore(state),
  );
  const columns = [
    {
      title: 'Navn',
      dataIndex: 'name',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUser) => (
        <Link to={`/users/${user.username}`}>{user.username}</Link>
      ),
    },
    {
      title: 'Score (Max 40)',
      dataIndex: 'score',
      search: false,
      inlineFiltering: false,
      render: (_, user: PublicUser) => (
        <p>{(user.achievementScore * 10).toFixed(2)}</p>
      ),
      sorter: (a: PublicUser, b: PublicUser) =>
        a.achievementScore - b.achievementScore,
    },
  ];

  return <Table columns={columns} data={users}></Table>;
};

export default Leaderboard;
