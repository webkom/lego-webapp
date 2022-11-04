// @flow

import { BarChart, Bar, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import {
  CHART_COLORS,
  DistributionDataPoint,
} from 'app/components/Chart/utils';

const DistributionBarChart = ({
  dataKey,
  distributionData,
}: {
  distributionData: DistributionDataPoint[];
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
        background={{ fill: 'var(--color-mono-gray-5)' }}
        isAnimationActive={false}
      >
        {distributionData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
          />
        ))}
      </Bar>
    </BarChart>
  );
};

export default DistributionBarChart;
