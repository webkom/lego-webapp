import { AlignLeft, CalendarRange } from 'lucide-react';
import InterestGroupIcon from '~/components/InterestGroupIcon';
import { ItemList } from './ItemList';
import type { ItemProps } from './Item';

const EventsDropdown = () => {
  const items: ItemProps[] = [
    { title: 'Oversikt', icon: <AlignLeft />, href: '/events' },
    { title: 'Kalender', icon: <CalendarRange />, href: '/events/calendar' },
    {
      title: 'Interessegrupper',
      icon: <InterestGroupIcon />,
      href: '/events/interest',
    },
  ];

  return <ItemList items={items} />;
};

export default EventsDropdown;
