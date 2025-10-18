import { Icon } from '@webkom/lego-bricks';
import { useState, useRef } from 'react';
import styles from './Collapsible.module.css';

type CollapsibleProps = {
  collapsedHeight: number;
  className: string;
  children: ReactNode[];
};

const Collapsible = (props: CollapsibleProps) => {
  const { children, collapsedHeight, className } = props;

  const [isOpened, setIsOpened] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const useCollapse = ref.current && collapsedHeight < ref.current.clientHeight;

  return (
    <div
      className={styles.collapse}
      style={{
        height: !useCollapse
          ? undefined
          : isOpened
            ? ref.current.clientHeight + 50
            : collapsedHeight + 'px',
      }}
    >
      <div className={className} ref={ref}>
        {children}
      </div>
      {useCollapse && (
        <div className={styles.showMore}>
          <Icon
            onPress={() => {
              setIsOpened(!isOpened);
            }}
            name={isOpened ? 'chevron-up' : 'chevron-down'}
            className={styles.showMoreIcon}
            size={30}
          />
        </div>
      )}
    </div>
  );
};

export default Collapsible;
