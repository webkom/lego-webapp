import { Item } from './Item';
import styles from './ItemGrid.module.css';
import type { ItemProps } from './Item';

type Props = {
  items: ItemProps[];
};

export const ItemGrid = ({ items }: Props) => {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Item key={item.title} {...item} />
      ))}
    </div>
  );
};
