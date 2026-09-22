import { Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import EmptyState from '~/components/EmptyState';
import { RankChange } from '~/pages/achievements/utils';
import { fetchTopClimbers } from '~/redux/actions/AchievementActions';
import { useAppDispatch } from '~/redux/hooks';
import styles from './TopClimbersCard.module.css';
import type { RankType } from '~/pages/achievements/utils';
import type { TopClimber } from '~/redux/actions/AchievementActions';

type Props = {
  type: RankType;
};

const TopClimbersCard = ({ type }: Props) => {
  const dispatch = useAppDispatch();
  const [climbers, setClimbers] = useState<TopClimber[]>();

  usePreparedEffect(
    'fetchTopClimbers',
    async () => {
      const res = await dispatch(fetchTopClimbers({ type }));
      setClimbers(res.payload);
    },
    [dispatch, type],
  );

  return (
    <div>
      <h2 className={styles.heading}>Topp 5 klatrere siste uke</h2>

      {climbers === undefined ? (
        <Skeleton height={200} />
      ) : climbers.length === 0 ? (
        <EmptyState
          iconNode={<TrendingUp />}
          body="Ingen har klatret siste uke enda"
        />
      ) : (
        climbers.map((climber, index) => (
          <div key={climber.username} className={styles.row}>
            <span className={styles.position}>{index + 1}.</span>
            <a href={`/users/${climber.username}`} className={styles.name}>
              {climber.fullName}
            </a>
            <span className={styles.rank}>#{climber.rank}</span>
            <RankChange current={climber.rank} previous={climber.rankWeekAgo} />
          </div>
        ))
      )}
    </div>
  );
};

export default TopClimbersCard;
