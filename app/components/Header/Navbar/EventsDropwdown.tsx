import { ItemProps } from './Item';
import ItemList from './ItemList';

const EventsDropdown = () => {
  const items: ItemProps[] = [
    { title: 'Liste', iconName: 'list-outline', to: '/events' },
    { title: 'Kalender', iconName: 'calendar-outline', to: '/events/calendar' },
  ];

  return <ItemList items={items} />;
};

export default EventsDropdown;
