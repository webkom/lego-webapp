import { AlignLeft, CalendarRange } from 'lucide-react';
import ItemList from './ItemList';
import type { ItemProps } from './Item';

const EventsDropdown = () => {
  const items: ItemProps[] = [
    { title: 'Oversikt', icon: <AlignLeft />, to: '/events' },
    { title: 'Kalender', icon: <CalendarRange />, to: '/events/calendar' },
  ];

  return <ItemList items={items} />;
};

export default EventsDropdown;
