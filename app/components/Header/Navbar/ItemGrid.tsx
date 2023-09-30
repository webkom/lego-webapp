import Item, { ItemProps } from './Item';
import styles from './ItemGrid.css';

type Props = {
  items: ItemProps[];
};

const ItemGrid = ({ items }: Props) => {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Item title={item.title} description={item.description} to={item.to} />
      ))}
    </div>
  );
};

export default ItemGrid;
