import { Flex, Skeleton } from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { PieChart, Cell, Pie, Tooltip } from 'recharts';
import {
  CHART_COLORS,
  renderCustomizedLabel,
} from 'app/components/Chart/utils';
import styles from './Chart.module.css';
import type { DistributionDataPoint } from 'app/components/Chart/utils';

type Props = {
  distributionData: DistributionDataPoint[];
  chartColors?: string[];
  fetching?: boolean;
};
const DistributionPieChart = ({
  chartColors = CHART_COLORS,
  distributionData,
  fetching = false,
}: Props) => {
  const [opacity, setOpacity] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (distributionData) {
      setOpacity(
        distributionData.reduce((prev, curr) => {
          prev[curr.name] = 1;
          return prev;
        }, {}),
      );
    }
  }, [distributionData]);

  const handleMouseEnter = (dataKey: string) => {
    setOpacity((prev) =>
      Object.keys(prev).reduce((newOpacity, key) => {
        newOpacity[key] = key === dataKey ? 1 : 0.5;
        return newOpacity;
      }, {}),
    );
  };

  const handleMouseLeave = () => {
    setOpacity((prev) =>
      Object.keys(prev).reduce((newOpacity, key) => {
        newOpacity[key] = 1;
        return newOpacity;
      }, {}),
    );
  };

  if (fetching) {
    return (
      <Skeleton width={224} height={224} className={styles.pieChartSkeleton} />
    );
  }

  return (
    <PieChart width={300} height={275}>
      <Pie
        data={distributionData}
        labelLine={false}
        label={renderCustomizedLabel}
        dataKey={'count'}
        outerRadius={110}
        isAnimationActive={false}
        onMouseLeave={handleMouseLeave}
      >
        {distributionData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fillOpacity={opacity[entry.name]}
            onMouseEnter={() => handleMouseEnter(entry.name)}
            fill={chartColors[index % chartColors.length]}
          />
        ))}
      </Pie>
      <Tooltip
        content={({ active, payload }) => {
          if (active && payload?.length) {
            return (
              <Flex
                alignItems="center"
                gap="var(--spacing-sm)"
                className={styles.tooltip}
              >
                <svg className={styles.circle} viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="15"
                    fill={payload[0].payload.fill}
                    stroke="white"
                    strokeWidth="7"
                  />
                </svg>
                <span className={styles.tooltipLabel}>
                  {payload[0].payload.name}
                </span>
                <span>{payload[0].value}</span>
              </Flex>
            );
          }

          return null;
        }}
      />
    </PieChart>
  );
};

export default DistributionPieChart;
