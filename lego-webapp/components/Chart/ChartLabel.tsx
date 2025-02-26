import { Flex } from '@webkom/lego-bricks';
import { CHART_COLORS } from '~/components/Chart/utils';
import styles from './Chart.module.css';
import type { DistributionDataPoint } from '~/components/Chart/utils';

const ChartLabel = ({
  distributionData,
}: {
  distributionData: DistributionDataPoint[];
}) => {
  return (
    <Flex column gap="var(--spacing-sm)" className={styles.chartLabel}>
      {distributionData.map((dataPoint, i) => (
        <Flex key={i} alignItems="center" gap="var(--spacing-sm)">
          <svg className={styles.circle} viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="16"
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              stroke="white"
              strokeWidth="8"
            />
          </svg>

          <span>{dataPoint.name}</span>
        </Flex>
      ))}
    </Flex>
  );
};

export default ChartLabel;
