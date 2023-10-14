import ItemList from './ItemList';
import type { ItemProps } from './Item';

const CareerDropdown = () => {
  const items: ItemProps[] = [
    {
      title: 'Jobbannonser',
      iconName: 'newspaper-outline',
      to: '/joblistings',
    },
    { title: 'Bedrifter', iconName: 'briefcase-outline', to: '/companies' },
  ];

  return <ItemList items={items} />;
};

export default CareerDropdown;
