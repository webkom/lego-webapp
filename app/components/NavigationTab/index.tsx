import { Icon, Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import NavigationLink from './NavigationLink';
import styles from './NavigationTab.css';
import type { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  back?: {
    label: string;
    path: string;
  };
  details?: ReactNode;
  headerClassName?: string;
  className?: string;
  skeleton?: boolean;
  children?: ReactNode;
};

const NavigationTab = ({
  title,
  back,
  details,
  headerClassName,
  className,
  skeleton,
  children,
}: Props) => (
  <>
    {back && (
      <NavLink
        to={back.path}
        onClick={(e) => {
          // TODO fix this hack when react-router is done
          if (!window.location.hash) return;
          window.history.back();
          e.preventDefault();
        }}
        className={styles.back}
      >
        <Icon name="arrow-back" size={19} className={styles.backIcon} />
        <span className={styles.backLabel}>{back.label}</span>
      </NavLink>
    )}
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
