import { sample } from 'lodash-es';
import {
  AlignLeft,
  Banana,
  CalendarRange,
  MountainSnow,
  Gamepad,
} from 'lucide-react';
import { ItemList } from './ItemList';
import type { ItemProps } from './Item';

const EventsDropdown = () => {
  const items: ItemProps[] = [
    { title: 'Oversikt', icon: <AlignLeft />, href: '/events' },
    { title: 'Kalender', icon: <CalendarRange />, href: '/events/calendar' },
    {
      title: 'Interessegrupper',
      icon: sample([
        <Banana key="1" />,
        <Gamepad key="2" />,
        <MountainSnow key="3" />,
      ]),
      href: '/interest-events',
    },
  ];

  return <ItemList items={items} />;
};

export default EventsDropdown;
