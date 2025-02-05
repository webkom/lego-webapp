import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './ContentSection.module.css';
import type { ReactNode } from 'react';

type Props = {
  reverse?: boolean;
  className?: string;
  children: ReactNode;
};

function ContentSection({ reverse, className, children }: Props) {
  return (
    <Flex
      className={cx(styles.section, className, { [styles.reverse]: reverse })}
    >
      {children}
    </Flex>
  );
}

export default ContentSection;
