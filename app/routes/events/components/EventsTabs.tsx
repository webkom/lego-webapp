import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';

const EventsTabs = () => (
  <>
    <NavigationTab href="/events">Liste</NavigationTab>
    <NavigationTab href="/events/calendar" matchSubpages>
      Kalender
    </NavigationTab>
  </>
);

export default EventsTabs;
