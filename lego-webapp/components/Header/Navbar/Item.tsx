import { Flex, Icon, Dropdown } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ChevronRight } from 'lucide-react';
import { Link } from '~/components/Link';
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
    <Link href={href} className={cx(Dropdown.itemClassName, styles.item)}>
      {icon ? (
        <TextWithIcon iconNode={icon} content={title} />
      ) : (
        <Flex alignItems="center">
          {title}{' '}
          <Icon
            size={18}
            className={styles.titleIcon}
            iconNode={<ChevronRight />}
          />
        </Flex>
      )}
      {description && <p className={styles.description}>{description}</p>}
    </Link>
  );
};
