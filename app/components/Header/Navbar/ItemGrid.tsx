import Item from './Item';
import styles from './ItemGrid.css';
import type { ItemProps } from './Item';

type Props = {
  items: ItemProps[];
};

const ItemGrid = ({ items }: Props) => {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Item
          key={item.title}
          title={item.title}
          description={item.description}
          to={item.to}
        />
      ))}
    </div>
  );
};

export default ItemGrid;
