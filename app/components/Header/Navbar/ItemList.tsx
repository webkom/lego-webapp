import Flex from 'app/components/Layout/Flex';
import Item from './Item';
import type { ItemProps } from './Item';

type Props = {
  items: ItemProps[];
};

const ItemList = ({ items }: Props) => {
  return (
    <Flex column={true}>
      {items.map((item) => (
        <Item
          key={item.title}
          iconName={item.iconName}
          title={item.title}
          to={item.to}
        />
      ))}
    </Flex>
  );
};

export default ItemList;
