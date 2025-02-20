import { usePreparedEffect } from '@webkom/react-prepare';
import { Link } from 'react-router';
import { ContentMain } from 'app/components/Content';
import Table from 'app/components/Table';
import { fetchLeaderboardUsers } from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { selectUsersWithAchievementsScore } from '~/redux/slices/users';
import type { ColumnProps } from 'app/components/Table';
import type { PublicUser } from '~/redux/models/User';

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
