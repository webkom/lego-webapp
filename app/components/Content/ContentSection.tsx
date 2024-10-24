import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './ContentSection.module.css';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

function ContentSection({ children, className }: Props) {
  return <Flex className={cx(styles.section, className)}>{children}</Flex>;
}

export default ContentSection;
