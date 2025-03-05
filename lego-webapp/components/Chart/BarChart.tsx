import { Skeleton } from '@webkom/lego-bricks';
import { BarChart, Bar, Cell, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from '~/components/Chart/utils';
import styles from './Chart.module.css';
import type { DistributionDataPoint } from '~/components/Chart/utils';

type Props = {
  distributionData: DistributionDataPoint[];
  chartColors?: string[];
  fetching?: boolean;
};
const DistributionBarChart = ({
  chartColors = CHART_COLORS,
  distributionData,
  fetching = false,
}: Props) => {
  if (fetching) {
    return (
      <Skeleton width={307} height={321} className={styles.barChartSkeleton} />
    );
  }

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
