import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './TabContainer.module.css';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  lineColor?: string;
  children?: ReactNode;
};

export const TabContainer = ({ className, lineColor, children }: Props) => {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const location = useLocation();

  useEffect(() => {
    const activeTab = document.querySelector('[data-active="true"]');
    if (activeTab) {
      const width = activeTab.clientWidth;
      const left = (activeTab as HTMLElement).offsetLeft;
      setIndicatorStyle({
        width: `${width}px`,
        transform: `translateX(${left}px)`,
      });
    }
  }, [children, location.pathname]);

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.tabList} style={{ borderColor: lineColor }}>
        {children}
        <div className={styles.indicator} style={indicatorStyle} />
      </div>
    </div>
  );
};
