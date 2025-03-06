import { BriefcaseBusiness, Newspaper } from 'lucide-react';
import { ItemList } from './ItemList';
import type { ItemProps } from './Item';

const CareerDropdown = () => {
  const items: ItemProps[] = [
    {
      title: 'Jobbannonser',
      icon: <Newspaper />,
      href: '/joblistings',
    },
    { title: 'Bedrifter', icon: <BriefcaseBusiness />, href: '/companies' },
  ];

  return <ItemList items={items} />;
};

export default CareerDropdown;
