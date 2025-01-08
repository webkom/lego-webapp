import { Flex, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Link } from 'react-router-dom';
import { fetchLeaderboardUsers } from 'app/actions/AchievementActions';
import Table from 'app/components/Table';
import { selectUsersWithAchievementsScore } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { AchievementTabs } from './utils';
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
  const fetching = useAppSelector((state) => state.users.fetching);
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
      render: (_, user: RankedUser) => <p>{user.achievementsScore}</p>,
      sorter: (a: RankedUser, b: RankedUser) =>
        b.achievementsScore - a.achievementsScore,
    },
  ];

  return (
    <Page
      tabs={<AchievementTabs />}
      title={
        <Flex alignItems="center" gap="var(--spacing-sm)">
          Topplister
        </Flex>
      }
    >
      <Table
        columns={columns}
        data={rankedUsers}
        loading={fetching}
        hasMore={false}
      />
      <LoadingIndicator loading={fetching} />
    </Page>
  );
};

export default Leaderboard;
