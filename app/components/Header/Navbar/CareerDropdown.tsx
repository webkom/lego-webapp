import { ItemProps } from './Item';
import ItemList from './ItemList';

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
