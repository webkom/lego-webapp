import type { Node } from 'react';
import { useRef, useState } from 'react';
import { Overlay } from 'react-overlays';
import cx from 'classnames';
import styles from './Popover.css';
type Props = {
  triggerComponent: Node;
  children: any;
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
