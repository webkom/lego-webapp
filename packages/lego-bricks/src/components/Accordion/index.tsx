import cx from 'classnames';
import { useCallback, useState } from 'react';
import styles from './Accordion.module.css';

type TriggerProps = {
  onClick: () => void;
  disabled: boolean;
  open: boolean;
  rotateClassName: string;
};

type Props = {
  disabled?: boolean;
  defaultOpen?: boolean;
  animated?: boolean;
  persistChildren?: boolean;
  wrapperClassName?: string;
  triggerPosition?: 'top' | 'bottom';
  triggerComponent: React.ComponentType<TriggerProps>;
  children: React.ReactNode;
};

/**
 * Unstyled component to toggle whether a section is displayed or not
 */
export const Accordion = ({
  disabled = false,
  defaultOpen = false,
  animated = true,
  persistChildren = false,
  triggerPosition = 'top',
  wrapperClassName,
  triggerComponent: TriggerComponent,
  children,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isTransitioning, setTransitioning] = useState(false);

  // useCallback works with dynamically changing children unlike useRef
  const childrenWrapperRef = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    const resizeObserver = new ResizeObserver(() =>
      setContainerHeight(node.getBoundingClientRect().height ?? 0),
    );
    resizeObserver.observe(node);
  }, []);

  const toggleOpen = () => {
    if (!disabled) {
      setOpen(!open);
      setTransitioning(true);
    }
  };

  // The specific containerHeight is only needed to animate the opening
  const openHeight = animated ? containerHeight : 'initial';

  // Render children if they should always be rendered,
  // otherwise keep them rendered as long as the accordion is not fully closed
  const renderChildren =
    persistChildren || open || (animated && isTransitioning);

  const trigger = (
    <TriggerComponent
      onClick={toggleOpen}
      disabled={disabled}
      open={open}
      rotateClassName={cx(
        animated && styles.rotateBase,
        open && styles.rotate90,
      )}
    />
  );

  return (
    <>
      {triggerPosition === 'top' && trigger}
      <div
        className={cx(
          styles.childrenWrapper,
          animated && styles.animate,
          wrapperClassName,
        )}
        style={{
          height: open ? openHeight : 0,
        }}
        onTransitionEnd={() => setTransitioning(false)}
      >
        {renderChildren && <div ref={childrenWrapperRef}>{children}</div>}
      </div>
      {triggerPosition === 'bottom' && trigger}
    </>
  );
};
