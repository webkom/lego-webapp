import ChartLabel from 'app/components/Chart/ChartLabel';
import DistributionPieChart from 'app/components/Chart/PieChart';
import type { DistributionDataPoint } from 'app/components/Chart/utils';
import { Flex } from 'app/components/Layout';

const PieChartWithLabel = ({
  label,
  distributionData,
  displayCount,
}: {
  label: string;
  distributionData: DistributionDataPoint[];
  displayCount?: boolean;
}) => {
  return (
    <>
      <h4>{label}</h4>
      <Flex alignItems="center" style={{ marginBottom: '3rem' }} wrap={true}>
        {distributionData.length === 0 && <p>Ingen data</p>}
        <DistributionPieChart
          dataKey="count"
          distributionData={distributionData}
        />
        <ChartLabel
          distributionData={distributionData}
          displayCount={displayCount}
        />
      </Flex>
    </>
  );
};

export default PieChartWithLabel;
