import type { DistributionDataPoint } from 'app/components/Chart/utils';
import { CHART_COLORS } from 'app/components/Chart/utils';
import { Flex } from 'app/components/Layout';
import styles from './Chart.module.css';

const ChartLabel = ({
  distributionData,
}: {
  distributionData: DistributionDataPoint[];
}) => {
  return (
    <div className={styles.wrapOnMobile}>
      {distributionData.map((dataPoint, i) => (
        <Flex key={i} alignItems="center">
          <span
            style={{
              backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
              width: '10px',
              height: '10px',
              marginRight: '10px',
              marginTop: '-5px',
              display: 'inline-block',
              borderRadius: '1px',
            }}
          />
          <span> {dataPoint.name}</span>
        </Flex>
      ))}
    </div>
  );
};

export default ChartLabel;
