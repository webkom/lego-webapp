import { Flex, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Link } from 'react-router-dom';
import { fetchLeaderboardUsers } from 'app/actions/AchievementActions';
import Table from 'app/components/Table';
import { selectUsersWithAchievementScore } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { ColumnProps } from 'app/components/Table';
import type { PublicUser } from 'app/store/models/User';
import { AchievementTabs } from './utils';
import { Info } from 'lucide-react';
import Tooltip from 'app/components/Tooltip';

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
    selectUsersWithAchievementScore(state),
  );
  const fetching = useAppSelector((state) => state.users.fetching);
  const rankedUsers: RankedUser[] = users
    .slice()
    .sort((a, b) => b.achievementScore - a.achievementScore)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  const columns: ColumnProps<RankedUser>[] = [
    {
      title: 'Posisjon',
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
      title: 'Score',
      dataIndex: 'score',
      search: false,
      inlineFiltering: false,
      render: (_, user: RankedUser) => <p>{user.achievementScore}</p>,
      sorter: (a: RankedUser, b: RankedUser) =>
        b.achievementScore - a.achievementScore,
    },
  ];

  return (
    <Page
      tabs={<AchievementTabs />}
      title={
        <Flex alignItems="center" gap="var(--spacing-sm)">
          Trofe-tabell
          <Tooltip
            content={
              'Listen rangerer brukere etter samlet trofe-score. Scoren tar hensyn til bl.a sjeldenhet og antall.'
            }
            positions="right"
          >
            <Info />
          </Tooltip>
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
