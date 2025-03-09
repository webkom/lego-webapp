import { Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchAnalytics } from '~/redux/actions/EventActions';
import { useAppDispatch } from '~/redux/hooks';
import { useParams } from '~/utils/useParams';
import styles from './Analytics.module.css';
import type { Dateish } from 'app/models';
import type { Analytics as AnalyticsType } from '~/redux/actions/EventActions';

const initialMetricValue = {
  visitors: { title: 'Besøkende', value: 0 },
  pageviews: { title: 'Sidevisninger', value: 0 },
  visitDuration: { title: 'Besøkstid', value: 0 },
};

const calculateMetrics = (data) => {
  // Copy initialMetricValue to avoid mutating it
  const initialValue = JSON.parse(JSON.stringify(initialMetricValue));

  return data.reduce((acc, item) => {
    acc.visitors.value += item.visitors;
    acc.pageviews.value += item.pageviews;
    acc.visitDuration.value += item.visitDuration;

    return acc;
  }, initialValue);
};

type Props = {
  viewStartTime: Dateish;
  viewEndTime: Dateish;
};

const Analytics = ({ viewStartTime, viewEndTime }: Props) => {
  const { eventId } = useParams<{ eventId: string }>();

  const [metrics, setMetrics] = useState<{
    visitors: { title: string; value: number };
    pageviews: { title: string; value: number };
    visitDuration: { title: string; value: number };
  }>(initialMetricValue);
  const [data, setData] = useState<AnalyticsType[]>([]);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAnalytics',
    () => {
      if (eventId) {
        return dispatch(fetchAnalytics(eventId)).then((response) => {
          let filteredData = response.payload.results;

          if (viewStartTime) {
            filteredData = filteredData.filter((item) =>
              moment(item.date).isSameOrAfter(moment(viewStartTime)),
            );
          }

          if (viewEndTime) {
            filteredData = filteredData.filter((item) =>
              moment(item.date).isSameOrBefore(moment(viewEndTime)),
            );
          }

          setData(filteredData);
          setMetrics(calculateMetrics(filteredData));
        });
      }
    },
    [eventId, viewStartTime, viewEndTime],
  );

  return (
    <Flex column gap="var(--spacing-md)">
      <Flex wrap gap="var(--spacing-xl)" className={styles.metrics}>
        {Object.values(metrics).map((metric) => (
          <Flex column justifyContent="center" key={metric.title}>
            <span className={styles.metricHeader}>{metric.title}</span>
            <span className={styles.metricNumber}>
              {metric.value.toLocaleString('no-NO')}
            </span>
          </Flex>
        ))}
      </Flex>

      <ResponsiveContainer width="100%" aspect={2.0 / 0.8}>
        <AreaChart
          data={data}
          margin={{
            left: -16,
          }}
        >
          <defs>
            <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="30%"
                stopColor="var(--color-blue-6)"
                stopOpacity={0.4}
              />
              <stop
                offset="75%"
                stopColor="var(--color-blue-5)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-white)"
                stopOpacity={0.2}
              />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              borderColor: 'var(--border-gray)',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'var(--lego-card-color)',
            }}
          />
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
            dataKey="visitors"
            tick={{ fill: 'var(--secondary-font-color)' }}
            stroke="var(--border-gray)"
          />
          <Area
            name="Besøkende"
            dataKey="visitors"
            type="monotone"
            stroke="var(--color-blue-6)"
            strokeWidth={3}
            strokeOpacity={1}
            fill="url(#colorView)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Flex>
  );
};

export default Analytics;
