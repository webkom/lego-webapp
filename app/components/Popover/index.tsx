import cx from 'classnames';
import { useRef, useState } from 'react';
import { Overlay } from 'react-overlays';
import styles from './Popover.module.css';
import type { ReactNode } from 'react';

type Props = {
  triggerComponent: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

const Popover = ({ triggerComponent, children, contentClassName }: Props) => {
  const [contentHovered, setContentHovered] = useState<boolean>(false);
  const [overlayHovered, setOverlayHovered] = useState<boolean>(false);
  const targetRef = useRef(null);
  return (
    <div
      onMouseEnter={() => setContentHovered(true)}
      onMouseLeave={() => setContentHovered(false)}
      ref={targetRef}
    >
      {triggerComponent}

      {(contentHovered || overlayHovered) && (
        <Overlay show placement="bottom" target={targetRef}>
          {({ props, arrowProps }) => (
            <div
              {...props}
              onMouseEnter={() => setOverlayHovered(true)}
              onMouseLeave={() => setOverlayHovered(false)}
              className={cx(styles.content, contentClassName)}
            >
              <div {...arrowProps} className={styles.arrow} />
              {children}
            </div>
          )}
        </Overlay>
      )}
    </div>
  );
};

export default Popover;
