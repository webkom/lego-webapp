import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';

export const AchievementTabs = () => (
  <>
    <NavigationTab href="/achievements">Oversikt</NavigationTab>
    <NavigationTab href="/achievements/leaderboard">Topplister</NavigationTab>
  </>
);
