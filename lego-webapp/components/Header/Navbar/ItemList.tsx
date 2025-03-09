import { Flex } from '@webkom/lego-bricks';
import { Item } from './Item';
import type { ItemProps } from './Item';

type Props = {
  items: ItemProps[];
};

export const ItemList = ({ items }: Props) => {
  return (
    <Flex column>
      {items.map((item) => (
        <Item key={item.title} {...item} />
      ))}
    </Flex>
  );
};
