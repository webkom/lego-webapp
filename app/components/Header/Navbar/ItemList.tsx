import Flex from 'app/components/Layout/Flex';
import Item, { ItemProps } from './Item';

type Props = {
  items: ItemProps[];
};

const ItemList = ({ items }: Props) => {
  return (
    <Flex column={true}>
      {items.map((item) => (
        <Item iconName={item.iconName} title={item.title} to={item.to} />
      ))}
    </Flex>
  );
};

export default ItemList;
