import { Flex } from '@webkom/lego-bricks';
import Item from './Item';
import type { ItemProps } from './Item';

type Props = {
  items: ItemProps[];
};

const ItemList = ({ items }: Props) => {
  return (
    <Flex column>
      {items.map((item) => (
        <Item
          key={item.title}
          icon={item.icon}
          title={item.title}
          to={item.to}
        />
      ))}
    </Flex>
  );
};

export default ItemList;
