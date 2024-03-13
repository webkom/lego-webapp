import { BarChart, Bar, Cell, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from 'app/components/Chart/utils';
import type { DistributionDataPoint } from 'app/components/Chart/utils';

type Props = {
  distributionData: DistributionDataPoint[];
  chartColors?: string[];
};
const DistributionBarChart = ({
  chartColors = CHART_COLORS,
  distributionData,
}: Props) => {
  return (
    <BarChart
      width={375}
      height={350}
      data={distributionData}
      margin={{
        top: 20,
        right: 30,
      }}
    >
      <XAxis dataKey=" " />
      <YAxis />
      <Bar
        dataKey={'count'}
        label={{ position: 'top' }}
        isAnimationActive={false}
      >
        {distributionData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={chartColors[index % chartColors.length]}
          />
        ))}
      </Bar>
    </BarChart>
  );
};

export default DistributionBarChart;
