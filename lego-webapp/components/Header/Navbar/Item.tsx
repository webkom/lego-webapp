import { Flex, Icon } from '@webkom/lego-bricks';
import { Link } from 'react-router';
import TextWithIcon from '~/components/TextWithIcon';
import styles from './Item.module.css';
import type { ReactNode } from 'react';

export type ItemProps = {
  title: string;
  icon?: ReactNode;
  to: string;
  description?: string;
};

const Item = ({ icon, title, to, description }: ItemProps) => {
  return (
    <Link to={to} className={styles.item}>
      {icon ? (
        <TextWithIcon iconNode={icon} content={title} />
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
