import { Flex } from '@webkom/lego-bricks';
import { ContentMain } from '~/components/Content';
import { RankTypeToggle } from '~/pages/achievements/utils';
import RankHistoryChart from './_components/RankHistoryChart';
import RarityOverviewChart from './_components/RarityOverviewChart';
import ScoreDistributionChart from './_components/ScoreDistributionChart';
import type { RankType } from '~/pages/achievements/utils';

type Props = {
  type: RankType;
};

const Statistics = ({ type }: Props) => (
  <ContentMain>
    <Flex column gap="var(--spacing-lg)">
      <RankTypeToggle type={type} basePath="/achievements/statistics" />

      <RankHistoryChart type={type} />
      <ScoreDistributionChart type={type} />
      <RarityOverviewChart />
    </Flex>
  </ContentMain>
);

export default Statistics;
