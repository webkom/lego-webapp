import type { DistributionDataPoint } from 'app/components/Chart/utils';

export const addGenericDataPoint = (
  selectedDistribution: DistributionDataPoint[],
  selectedDataPoint: string
) => {
  const dataPointEntry = selectedDistribution.find(
    (entry) => entry.name === selectedDataPoint
  );
  if (dataPointEntry) {
    dataPointEntry.count++;
  } else {
    selectedDistribution.push({ name: selectedDataPoint, count: 1 });
  }
};
