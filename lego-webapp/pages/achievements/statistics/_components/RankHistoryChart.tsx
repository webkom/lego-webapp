import { Flex, Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { TrendingUp } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from '~/components/Chart/Chart.module.css';
import EmptyState from '~/components/EmptyState';
import { fetchRankHistory } from '~/redux/actions/AchievementActions';
import { useAppDispatch } from '~/redux/hooks';
import type { RankType } from '~/pages/achievements/utils';

type Props = {
  type: RankType;
};

type HistoryPoint = { date: string; rank: number; value: number };

const RankHistoryChart = ({ type }: Props) => {
  const dispatch = useAppDispatch();
  const [history, setHistory] = useState<HistoryPoint[]>();
  const isPercentage = type === 'achievement_score';
  const valueLabel = isPercentage
    ? 'Fullføringsprosent'
    : 'Antall arrangementer';
  const formatValue = (value: number) =>
    isPercentage ? `${value}%` : `${value}`;

  usePreparedEffect(
    'fetchRankHistory',
    async () => {
      const res = await dispatch(fetchRankHistory({ type }));
      const spansMultipleYears =
        new Set(res.payload.map((point) => moment(point.date).year())).size > 1;
      const dateFormat = spansMultipleYears ? 'DD. MMM YY' : 'DD. MMM';
      setHistory(
        res.payload.map((point) => ({
          date: moment(point.date).format(dateFormat),
          rank: point.rank,
          value: point.value,
        })),
      );
    },
    [dispatch, type],
  );

  return (
    <div>
      <h2>Din rangeringshistorikk for {valueLabel.toLowerCase()}</h2>
      {history === undefined ? (
        <Skeleton height={300} />
      ) : history.length === 0 ? (
        <EmptyState
          iconNode={<TrendingUp />}
          body="Ingen rangeringshistorikk enda"
        />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={history}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--color-blue-5)"
              opacity={0.4}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--secondary-font-color)' }}
              stroke="var(--border-gray)"
            />
            <YAxis
              reversed
              allowDecimals={false}
              tick={{ fill: 'var(--secondary-font-color)' }}
              stroke="var(--border-gray)"
              label={{
                value: 'Plassering',
                angle: -90,
                position: 'insideLeft',
                fill: 'var(--secondary-font-color)',
              }}
            />
            <Tooltip
              cursor={{ stroke: 'var(--border-gray)' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) {
                  return null;
                }
                const point = payload[0].payload as HistoryPoint;
                return (
                  <Flex
                    column
                    gap="var(--spacing-xs)"
                    className={styles.tooltip}
                  >
                    <span className={styles.tooltipLabel}>{label}</span>
                    <span>Plassering: #{point.rank}</span>
                    <span>
                      {valueLabel}: {formatValue(point.value)}
                    </span>
                  </Flex>
                );
              }}
            />
            <Line
              type="stepAfter"
              dataKey="rank"
              name="Plassering"
              stroke="var(--color-blue-6)"
              dot={{ r: 3, fill: 'var(--color-blue-6)' }}
              activeDot={{
                r: 5,
                fill: 'var(--lego-card-color)',
                stroke: 'var(--color-blue-6)',
                strokeWidth: 2,
              }}
            >
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value) => formatValue(Number(value))}
                style={{ fill: 'var(--secondary-font-color)', fontSize: 11 }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RankHistoryChart;
