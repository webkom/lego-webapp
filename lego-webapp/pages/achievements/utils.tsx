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

/**
 * Rank delta since some earlier baseline, shared by the leaderboard table's
 * "Siste uke"/"Siste måned" columns and the statistics page's top-climbers
 * list. null current/previous means "no history to compare against yet"
 * rather than "no change".
 */
export const RankChange = ({
  current,
  previous,
}: {
  current: number | null;
  previous: number | null;
}) => {
  if (current === null || previous === null) {
    return <span aria-label="Ingen historikk enda">-</span>;
  }

  const diff = previous - current;

  if (diff === 0) {
    return <span aria-label="Ingen endring"> =</span>;
  }

  if (diff > 0) {
    return (
      <span
        style={{ color: 'var(--color-green-7)' }}
        aria-label={`Opp ${diff} plasser`}
      >
        ↑ {diff}
      </span>
    );
  }

  return (
    <span
      style={{ color: 'var(--color-red-7)' }}
      aria-label={`Ned ${Math.abs(diff)} plasser`}
    >
      ↓ {Math.abs(diff)}
    </span>
  );
};

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
