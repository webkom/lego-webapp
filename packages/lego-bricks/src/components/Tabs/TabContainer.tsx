import cx from 'classnames';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from '../../RouterContext';
import styles from './TabContainer.module.css';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  lineColor?: string;
  children?: ReactNode;
};

export const TabContainer = ({ className, lineColor, children }: Props) => {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);
  const tabListRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const checkScroll = () => {
    const element = tabListRef.current;
    if (element) {
      setShowLeftShadow(element.scrollLeft > 0);
      setShowRightShadow(
        Math.ceil(element.scrollLeft) <
          element.scrollWidth - element.clientWidth - 1,
      );
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const element = tabListRef.current;
    if (element) {
      const scrollAmount = element.clientWidth * 0.8;
      element.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const activeTab = document.querySelector('[data-active="true"]');
    if (activeTab) {
      const width = activeTab.clientWidth;
      const left = (activeTab as HTMLElement).offsetLeft;
      setIndicatorStyle({
        width: `${width}px`,
        transform: `translateX(${left}px)`,
      });

      // Scroll into view
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
    checkScroll();
  }, [children, location.pathname]);

  useEffect(() => {
    const element = tabListRef.current;
    if (element) {
      element.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      checkScroll();
    }

    return () => {
      element?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <div
      className={cx(
        styles.container,
        className,
        showLeftShadow && styles.showLeftShadow,
        showRightShadow && styles.showRightShadow,
      )}
    >
      <button
        className={cx(styles.scrollButton, styles.left)}
        onClick={() => handleScroll('left')}
        aria-label="Scroll left"
      >
        <ChevronLeft />
      </button>
      <div
        ref={tabListRef}
        className={styles.tabList}
        style={{ borderColor: lineColor }}
      >
        {children}
        <div className={styles.indicator} style={indicatorStyle} />
      </div>
      <button
        className={cx(styles.scrollButton, styles.right)}
        onClick={() => handleScroll('right')}
        aria-label="Scroll right"
      >
        <ChevronRight />
      </button>
    </div>
  );
};
