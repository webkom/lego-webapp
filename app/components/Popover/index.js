// @flow

import type { Node } from 'react';

import { useRef, useState } from 'react';
import { Overlay } from 'react-overlays';
import cx from 'classnames';
import styles from './Popover.css';

type Props = {
  triggerComponent: Node,
  children: any,
  placement?: 'top' | 'bottom' | 'left' | 'right',
  contentClassName?: string,
};

const Popover = ({
  triggerComponent,
  children,
  placement = 'bottom',
  contentClassName,
}: Props) => {
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
        <Overlay show placement={placement} target={targetRef}>
          {({ props }) => (
            <div
              {...props}
              onMouseEnter={() => setOverlayHovered(true)}
              onMouseLeave={() => setOverlayHovered(false)}
              className={cx(styles.content, contentClassName)}
            >
              {children}
            </div>
          )}
        </Overlay>
      )}
    </div>
  );
};

export default Popover;
