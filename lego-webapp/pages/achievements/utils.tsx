import { Tab, TabContainer } from '@webkom/lego-bricks';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';
import styles from './utils.module.css';
import type { Ranking } from '~/redux/models/User';

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

export type Metric = 'achievement_score' | 'event_count';

export const METRIC_LABELS: Record<Metric, string> = {
  achievement_score: 'Fullføringsprosent',
  event_count: 'Arrangementer',
};

export type Population = 'classic' | 'active';

export const POPULATION_LABELS: Record<Population, string> = {
  active: 'Aktive',
  classic: 'Klassisk',
};

export type RankType =
  | 'achievement_score'
  | 'achievement_score_active'
  | 'event_count'
  | 'event_count_active';

export const toRankType = (metric: Metric, population: Population): RankType =>
  population === 'active' ? (`${metric}_active` as RankType) : metric;

const RANKING_KEY_BY_TYPE: Record<RankType, keyof Ranking> = {
  achievement_score: 'achievementScore',
  achievement_score_active: 'achievementScoreActive',
  event_count: 'eventCount',
  event_count_active: 'eventCountActive',
};

export const rankingKey = (
  metric: Metric,
  population: Population,
): keyof Ranking => RANKING_KEY_BY_TYPE[toRankType(metric, population)];

export const RankTypeToggle = ({
  metric,
  basePath,
}: {
  metric: Metric;
  basePath: string;
}) => (
  <TabContainer>
    {(Object.keys(METRIC_LABELS) as Metric[]).map((m) => (
      <Tab
        key={m}
        active={metric === m}
        href={m === 'achievement_score' ? basePath : `${basePath}/event-count`}
      >
        {METRIC_LABELS[m]}
      </Tab>
    ))}
  </TabContainer>
);

// Not Tab/TabContainer - its active indicator only moves on route change.
export const PopulationToggle = ({
  population,
  onChange,
}: {
  population: Population;
  onChange: (population: Population) => void;
}) => (
  <div className={styles.populationToggle}>
    {(Object.keys(POPULATION_LABELS) as Population[]).map((p) => (
      <button
        key={p}
        type="button"
        data-active={population === p}
        className={styles.populationButton}
        onClick={() => onChange(p)}
      >
        {POPULATION_LABELS[p]}
      </button>
    ))}
  </div>
);

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
  programGroupIds: '',
  completed: 'all',
};

export const leaderboardDefaultSearch = {
  min_rarity: 'any',
  max_rarity: 'any',
  sort: 'rarity',
  sort_order: 'desc',
};
