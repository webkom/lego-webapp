import { Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import NavigationLink from './NavigationLink';
import styles from './NavigationTab.css';
import type { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  details?: ReactNode;
  headerClassName?: string;
  className?: string;
  skeleton?: boolean;
  children?: ReactNode;
};

const NavigationTab = ({
  title,
  details,
  headerClassName,
  className,
  skeleton,
  children,
}: Props) => (
  <>
    <div className={cx(styles.container, className)}>
      {skeleton ? (
        <Skeleton
          className={cx(styles.header, styles.skeletonHeader, headerClassName)}
        />
      ) : (
        <h1 className={cx(styles.header, headerClassName)}>{title}</h1>
      )}
      <div className={styles.navigator}>{children}</div>
    </div>
    <div className={styles.details}>{details}</div>
  </>
);

export default NavigationTab;
export { NavigationLink };
