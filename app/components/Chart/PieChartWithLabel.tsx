import ChartLabel from 'app/components/Chart/ChartLabel';
import DistributionPieChart from 'app/components/Chart/PieChart';
import type { DistributionDataPoint } from 'app/components/Chart/utils';
import { Flex } from 'app/components/Layout';
import styles from './Chart.css';

const PieChartWithLabel = ({
  label,
  distributionData,
  displayCount,
  namedChartColors,
}: {
  label: string;
  distributionData: DistributionDataPoint[];
  displayCount?: boolean;
  namedChartColors?: Record<string, string>;
}) => {
  return (
    <>
      <h4>{label}</h4>
      <Flex alignItems="center" className={styles.pieChartContainer} wrap>
        {distributionData.length === 0 && <p>Ingen data</p>}
        <DistributionPieChart
          dataKey="count"
          distributionData={distributionData}
          namedChartColors={namedChartColors}
        />
        <ChartLabel
          distributionData={distributionData}
          displayCount={displayCount}
          namedChartColors={namedChartColors}
        />
      </Flex>
    </>
  );
};

export default PieChartWithLabel;
