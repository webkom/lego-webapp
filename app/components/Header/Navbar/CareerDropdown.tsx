import { BriefcaseBusiness, Newspaper } from 'lucide-react';
import ItemList from './ItemList';
import type { ItemProps } from './Item';

const CareerDropdown = () => {
  const items: ItemProps[] = [
    {
      title: 'Jobbannonser',
      icon: <Newspaper />,
      to: '/joblistings',
    },
    { title: 'Bedrifter', icon: <BriefcaseBusiness />, to: '/companies' },
  ];

  return <ItemList items={items} />;
};

export default CareerDropdown;
