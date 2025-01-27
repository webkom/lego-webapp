import { usePreparedEffect } from '@webkom/react-prepare';
import { Link } from 'react-router-dom';
import { fetchLeaderboardUsers } from 'app/actions/AchievementActions';
import { ContentMain } from 'app/components/Content';
import Table from 'app/components/Table';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectUsersWithAchievementsScore } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import type { ColumnProps } from 'app/components/Table';
import type { PublicUser } from 'app/store/models/User';

type RankedUser = PublicUser & {
  rank: number;
};

const Leaderboard = () => {
  const dispatch = useAppDispatch();

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/achievements/leaderboard/',
      entity: EntityType.Users,
      query: {},
    })(state),
  );

  usePreparedEffect(
    'fetchLeaderboardUsers',
    () => {
      dispatch(fetchLeaderboardUsers({ next: true }));
    },
    [dispatch],
  );
  const users = useAppSelector((state) =>
    selectUsersWithAchievementsScore(state),
  );
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
        loading={pagination.fetching}
        hasMore={pagination.hasMore}
        onLoad={() => {
          dispatch(fetchLeaderboardUsers({ next: true }));
        }}
      />
    </ContentMain>
  );
};

export default Leaderboard;
