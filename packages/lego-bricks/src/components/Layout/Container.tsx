import cx from 'classnames';
import styles from './Container.module.css';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

function Container({ children, className }: Props) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export default Container;
