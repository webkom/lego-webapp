import { PieChart, Cell, Pie } from 'recharts';
import type { DistributionDataPoint } from 'app/components/Chart/utils';
import {
  CHART_COLORS,
  renderCustomizedLabel,
} from 'app/components/Chart/utils';

const DistributionPieChart = ({
  dataKey,
  distributionData,
}: {
  distributionData: DistributionDataPoint[];
  dataKey: string;
}) => {
  return (
    <PieChart width={400} height={350}>
      <Pie
        data={distributionData}
        cx={200}
        cy={150}
        labelLine={false}
        label={renderCustomizedLabel}
        dataKey={dataKey}
        outerRadius={110}
        isAnimationActive={false}
      >
        {distributionData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
          />
        ))}
      </Pie>
    </PieChart>
  );
};

export default DistributionPieChart;
