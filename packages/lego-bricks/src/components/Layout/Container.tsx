import cx from 'classnames';
import styles from './Container.module.css';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

function Container({ children, className }: Props) {
  return (
    <div className={cx(styles.content, className)}>
      <img
        src="https://www.shakeout.org/2008/downloads/ShakeOut_BannerAds_JoinUs_160x600_v2.gif"
        alt="test"
      />
      <div className={styles.prank}>{children}</div>
      <img
        src="https://www.shakeout.org/2008/downloads/ShakeOut_BannerAds_JoinUs_160x600_v2.gif"
        alt="test"
      />
    </div>
  );
}

export default Container;
