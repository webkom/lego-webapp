import { EntityId } from '@reduxjs/toolkit';
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
import {
  type Analytics as AnalyticsType,
  type AnalyticsEntity,
  fetchAnalytics,
} from '~/redux/actions/AnalyticsActions';
import { useAppDispatch } from '~/redux/hooks';
import { DatePicker } from '../Form';
import styles from './Analytics.module.css';
import type { Dateish } from 'app/models';

const initialMetricValue: Metrics = {
  visitors: { title: 'Besøkende', value: 0 },
  pageviews: { title: 'Sidevisninger', value: 0 },
  visitDuration: { title: 'Besøkstid', value: 0 },
};

const calculateMetrics = (data: AnalyticsType[]) => {
  // Copy initialMetricValue to avoid mutating it
  const initialValue = { ...initialMetricValue };

  return data.reduce((acc, item) => {
    acc.visitors.value += item.visitors || 0;
    acc.pageviews.value += item.pageviews || 0;
    acc.visitDuration.value += item.visitDuration || 0;

    return acc;
  }, initialValue);
};

type Metric = {
  title: string;
  value: number;
};

type Metrics = {
  visitors: Metric;
  pageviews: Metric;
  visitDuration: Metric;
};

type Props = {
  entity: AnalyticsEntity;
  id: EntityId;
  title?: string;
  description?: string;
};

const Analytics = ({ entity, id, title, description }: Props) => {
  const [metrics, setMetrics] = useState<Metrics>(initialMetricValue);
  const [data, setData] = useState<AnalyticsType[]>([]);

  const [dateRange, setDateRange] = useState<[Dateish, Dateish]>([
    moment().subtract(1, 'month').toISOString(),
    moment().toISOString(),
  ]);
  const updateDateRange = (selectedDate: [Dateish, Dateish]) => {
    setDateRange(selectedDate);
  };
  const viewStartTime = dateRange[0];
  const viewEndTime = dateRange[1];

  const dispatch = useAppDispatch();

  const entityUpperCase = entity.charAt(0).toUpperCase() + entity.slice(1);
  const effectIdentifier = 'fetch' + entityUpperCase + 'Analytics';

  usePreparedEffect(effectIdentifier, () => {
    if (id) {
      return dispatch(
        fetchAnalytics({
          entity: entity,
          id: id,
        }),
      ).then((response) => {
        let filteredData = response.payload.results;
        console.log(filteredData);

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
  }, [id, viewStartTime, viewEndTime]);

  return (
    <Flex column gap="var(--spacing-md)">
      <div>
        <h2>{title ?? 'Analyse'}</h2>
        <span className="secondaryFontColor">
          {description ??
            `Analyse av besøkende på siden ${entity + 's/' + id + '*'}`}
        </span>
      </div>

      <Flex column gap="var(--spacing-md)">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex wrap gap="var(--spacing-xl)">
            {Object.values(metrics).map((metric) => (
              <Flex column justifyContent="center" key={metric.title}>
                <span className={styles.metricHeader}>{metric.title}</span>
                <span className={styles.metricNumber}>
                  {metric.value.toLocaleString('no-NO')}
                </span>
              </Flex>
            ))}
          </Flex>
          <Flex column width="30%">
            <label className={styles.datePickerLabel}>Velg periode</label>
            <DatePicker
              range
              value={dateRange}
              onChange={updateDateRange}
              showTimePicker={false}
              onBlur={() => {}}
              onFocus={() => {}}
            />
          </Flex>
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
    </Flex>
  );
};

export default Analytics;
