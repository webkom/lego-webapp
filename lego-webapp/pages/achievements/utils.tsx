import { Tab, TabContainer } from '@webkom/lego-bricks';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';

export const AchievementTabs = () => (
  <>
    <NavigationTab href="/achievements">Oversikt</NavigationTab>
    <NavigationTab href="/achievements/leaderboard" matchSubpages>
      Topplister
    </NavigationTab>
    <NavigationTab href="/achievements/statistics" matchSubpages>
      Statistikk
    </NavigationTab>
  </>
);

export type RankType = 'achievement_score' | 'event_count';

export const RANK_TYPE_LABELS: Record<RankType, string> = {
  achievement_score: 'Fullføringsprosent',
  event_count: 'Arrangementer',
};

/**
 * Same achievement_score/event_count switch used on both /achievements/leaderboard
 * and /achievements/statistics - basePath points at whichever feature is active,
 * e.g. "/achievements/leaderboard" -> "/achievements/leaderboard/event-count".
 */
export const RankTypeToggle = ({
  type,
  basePath,
}: {
  type: RankType;
  basePath: string;
}) => (
  <TabContainer>
    {(Object.keys(RANK_TYPE_LABELS) as RankType[]).map((rankType) => (
      <Tab
        key={rankType}
        active={type === rankType}
        href={
          rankType === 'achievement_score'
            ? basePath
            : `${basePath}/event-count`
        }
      >
        {RANK_TYPE_LABELS[rankType]}
      </Tab>
    ))}
  </TabContainer>
);

export const overviewDefaultSearch = {
  userFullName: '',
  abakusGroupIds: '',
  completed: 'all',
};

export const leaderboardDefaultSearch = {
  min_rarity: 'any',
  max_rarity: 'any',
  sort: 'rarity',
  sort_order: 'desc',
};
