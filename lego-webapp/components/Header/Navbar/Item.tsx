import { Flex, Icon } from '@webkom/lego-bricks';
import TextWithIcon from '~/components/TextWithIcon';
import styles from './Item.module.css';
import type { ReactNode } from 'react';

export type ItemProps = {
  title: string;
  icon?: ReactNode;
  href: string;
  description?: string;
};

export const Item = ({ icon, title, href, description }: ItemProps) => {
  return (
    <a href={href} className={styles.item}>
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
    </a>
  );
};
