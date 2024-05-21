import cx from 'classnames';
import { Flex } from '../Layout';
import styles from './TabContainer.module.css';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  lineColor?: string;
  children?: ReactNode;
};

export const TabContainer = ({ className, lineColor, children }: Props) => (
  <Flex wrap className={cx(styles.container, className)}>
    {children}
    <div className={styles.spacer} style={{ borderColor: lineColor }} />
  </Flex>
);
