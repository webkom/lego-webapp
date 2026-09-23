import { AlignLeft, CalendarRange } from 'lucide-react';
import getInterestIcon from '~/utils/getInterestIcon';
import { ItemList } from './ItemList';
import type { ItemProps } from './Item';

const EventsDropdown = () => {
  const InterestIcon = getInterestIcon();
  const items: ItemProps[] = [
    { title: 'Oversikt', icon: <AlignLeft />, href: '/events' },
    { title: 'Kalender', icon: <CalendarRange />, href: '/events/calendar' },
    {
      title: 'Interessegrupper',
      icon: <InterestIcon />,
      href: '/events/interest',
    },
  ];

  return <ItemList items={items} />;
};

export default EventsDropdown;
