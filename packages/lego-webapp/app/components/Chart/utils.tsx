export interface DistributionDataPoint {
  name: string;
  count: number;
}

export const CHART_COLORS = [
  'var(--color-blue-6)',
  'var(--color-orange-6)',
  'var(--color-green-7)',
  'var(--color-red-4)',
  'var(--color-purple-5)',
  'var(--color-blue-5)',
  'var(--color-orange-5)',
  'var(--color-green-6)',
  'var(--color-purple-7)',
];

type GraphProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
};

const RADIAN = Math.PI / 180;

export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: GraphProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Hide the percent if it is too small to fit the chart
  if (percent < 0.04) {
    return;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
