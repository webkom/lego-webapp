import TextWithIcon from 'app/components/TextWithIcon';
import { Link } from 'react-router-dom';
import styles from './Item.css';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';

export type ItemProps = {
  title: string;
  iconName?: string;
  to: string;
  description?: string;
};

const Item = ({ iconName, title, to, description }: ItemProps) => {
  return (
    <Link to={to} className={styles.item}>
      {iconName ? (
        <TextWithIcon iconName={iconName} content={title} />
      ) : (
        <Flex alignItems="center">
          {title}{' '}
          <Icon
            size={18}
            className={styles.titleIcon}
            name="chevron-forward-outline"
          />
        </Flex>
      )}
      {description && <p className={styles.description}>{description}</p>}
    </Link>
  );
};

export default Item;
