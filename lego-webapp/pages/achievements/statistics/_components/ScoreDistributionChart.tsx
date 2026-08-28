import { Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { BarChart3 } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import EmptyState from '~/components/EmptyState';
import {
  fetchScoreDistribution,
  type ScoreDistribution,
} from '~/redux/actions/AchievementActions';
import { useAppDispatch } from '~/redux/hooks';
import type { RankType } from '~/pages/achievements/utils';

type Props = {
  type: RankType;
};

const formatBinLabel = (min: number, max: number, isPercentage: boolean) =>
  isPercentage
    ? `${Math.round(min)}–${Math.round(max)}%`
    : `${Math.round(min)}–${Math.round(max)}`;

const findYourBinIndex = (distribution: ScoreDistribution) => {
  if (distribution.yourValue === null) {
    return -1;
  }
  return distribution.bins.findIndex(
    (bin, index) =>
      distribution.yourValue! >= bin.min &&
      (distribution.yourValue! < bin.max ||
        index === distribution.bins.length - 1),
  );
};

const ScoreDistributionChart = ({ type }: Props) => {
  const dispatch = useAppDispatch();
  const [distribution, setDistribution] = useState<ScoreDistribution>();
  const isPercentage = type === 'achievement_score';
  const title = isPercentage
    ? 'Fordeling av fullføringsprosent'
    : 'Fordeling av antall arrangementer';

  usePreparedEffect(
    'fetchScoreDistribution',
    async () => {
      const res = await dispatch(fetchScoreDistribution({ type }));
      setDistribution(res.payload);
    },
    [dispatch, type],
  );

  if (distribution === undefined) {
    return (
      <div>
        <h2>{title}</h2>
        <Skeleton height={300} />
      </div>
    );
  }

  if (distribution.totalCount === 0) {
    return (
      <div>
        <h2>{title}</h2>
        <EmptyState iconNode={<BarChart3 />} body="Ingen data enda" />
      </div>
    );
  }

  const yourBinIndex = findYourBinIndex(distribution);
  const data = distribution.bins.map((bin) => ({
    range: formatBinLabel(bin.min, bin.max, isPercentage),
    count: bin.count,
  }));

  return (
    <div>
      <h2>{title}</h2>
      {distribution.percentile !== null && (
        <p className="secondaryFontColor">
          Du ligger foran <strong>{distribution.percentile}%</strong> av de{' '}
          {distribution.totalCount} rangerte brukerne
        </p>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, bottom: 5 }}>
          <XAxis
            dataKey="range"
            tick={{ fill: 'var(--secondary-font-color)' }}
            stroke="var(--border-gray)"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: 'var(--secondary-font-color)' }}
            stroke="var(--border-gray)"
          />
          <Tooltip
            cursor={{ fill: 'var(--border-gray)', opacity: 0.3 }}
            contentStyle={{
              borderColor: 'var(--border-gray)',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'var(--lego-card-color)',
            }}
            labelStyle={{ color: 'var(--lego-font-color)' }}
            itemStyle={{ color: 'var(--lego-font-color)' }}
          />
          <Bar dataKey="count" name="Antall brukere" isAnimationActive={false}>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={
                  index === yourBinIndex
                    ? 'var(--color-orange-6)'
                    : 'var(--color-blue-6)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreDistributionChart;
