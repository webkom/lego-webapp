import { BarChart, Bar, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from 'app/components/Chart/utils';
import type { DistributionDataPoint } from 'app/components/Chart/utils';

const DistributionBarChart = ({
  dataKey,
  chartColors = CHART_COLORS,
  distributionData,
}: {
  distributionData: DistributionDataPoint[];
  chartColors: string[];
  dataKey: string;
}) => {
  return (
    <BarChart
      width={375}
      height={350}
      data={distributionData}
      margin={{
        top: 50,
        right: 30,
        left: 20,
        bottom: 10,
      }}
    >
      <XAxis dataKey=" " />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar
        dataKey={dataKey}
        label={{ position: 'top' }}
        background={{ fill: 'var(--additive-background)' }}
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
