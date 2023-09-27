import { PieChart, Cell, Pie } from 'recharts';
import {
  CHART_COLORS,
  renderCustomizedLabel,
} from 'app/components/Chart/utils';
import type { DistributionDataPoint } from 'app/components/Chart/utils';

type Props = {
  distributionData: DistributionDataPoint[];
  chartColors?: string[];
};
const DistributionPieChart = ({
  chartColors = CHART_COLORS,
  distributionData,
}: Props) => {
  return (
    <PieChart width={400} height={275}>
      <Pie
        data={distributionData}
        cx={200}
        cy={150}
        labelLine={false}
        label={renderCustomizedLabel}
        dataKey={'count'}
        outerRadius={110}
        isAnimationActive={false}
      >
        {distributionData.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={chartColors[index % chartColors.length]}
          />
        ))}
      </Pie>
    </PieChart>
  );
};

export default DistributionPieChart;
