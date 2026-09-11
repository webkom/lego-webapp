import { Flex } from '@webkom/lego-bricks';
import { ContentMain } from '~/components/Content';
import {
  PopulationToggle,
  RankTypeToggle,
  toRankType,
} from '~/pages/achievements/utils';
import useQuery from '~/utils/useQuery';
import RankHistoryChart from './_components/RankHistoryChart';
import RarityOverviewChart from './_components/RarityOverviewChart';
import ScoreDistributionChart from './_components/ScoreDistributionChart';
import TopClimbersCard from './_components/TopClimbersCard';
import type { Metric, Population } from '~/pages/achievements/utils';

type Props = {
  metric: Metric;
};

const Statistics = ({ metric }: Props) => {
  const { query, setQueryValue } = useQuery({
    population: 'active' as Population,
  });
  const population = query.population;
  const rankType = toRankType(metric, population);

  return (
    <ContentMain>
      <Flex column gap="var(--spacing-lg)">
        <Flex justifyContent="space-between" wrap gap="var(--spacing-md)">
          <RankTypeToggle metric={metric} basePath="/achievements/statistics" />
          <PopulationToggle
            population={population}
            onChange={setQueryValue('population')}
          />
        </Flex>

        <RankHistoryChart type={rankType} />
        <TopClimbersCard type={rankType} />
        <ScoreDistributionChart type={rankType} />
        <RarityOverviewChart />
      </Flex>
    </ContentMain>
  );
};

export default Statistics;
