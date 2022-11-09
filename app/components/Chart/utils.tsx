export interface DistributionDataPoint {
  name: string;
  count: number;
}

export const CHART_COLORS = [
  'var(--lego-red)',
  'var(--color-blue-4)',
  'var(--color-orange-3)',
  'var(--color-green-5)',
  'var(--lego-chart-purple)',
  'var(--lego-chart-yellow)',
  '#ff87eb',
  'var(--lego-chart-black)',
  'var(--lego-chart-green)',
  'var(--lego-chart-blue)',
  'var(--lego-chart-salmon)',
  'var(--lego-chart-navajo)',
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
