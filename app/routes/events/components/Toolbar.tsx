import { TabContainer } from '@webkom/lego-bricks';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';

const Toolbar = () => (
  <TabContainer>
    <NavigationTab href="/events">Liste</NavigationTab>
    <NavigationTab href="/events/calendar" matchSubpages>
      Kalender
    </NavigationTab>
  </TabContainer>
);

export default Toolbar;
