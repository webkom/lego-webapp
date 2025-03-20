import { NavigationTab } from '~/components/NavigationTab/NavigationTab';

export const AchievementTabs = () => (
  <>
    <NavigationTab href="/achievements">Oversikt</NavigationTab>
    <NavigationTab href="/achievements/leaderboard">Topplister</NavigationTab>
  </>
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
