import cx from 'classnames';
import { useCallback, useEffect, useState } from 'react';
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
  removeChildrenOnClose?: boolean;
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
  removeChildrenOnClose = false,
  triggerPosition = 'top',
  wrapperClassName,
  triggerComponent: TriggerComponent,
  children,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const [initialRender, setInitialRender] = useState(true);
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
    if (disabled) return;
    if (initialRender && animated) {
      // setOpen is triggered through useEffect to ensure proper order of actions
      setInitialRender(false);
    } else {
      setOpen(!open);
    }
    setTransitioning(true);
  };

  // Ensures that the open flag is triggered after the initialRender flag is changed
  // so the height of "initial" is changed to a numeric value to make the animation work
  useEffect(() => {
    if (!initialRender) setOpen(!open);
    //eslint-disable-next-line
  }, [initialRender]);

  // Skip containerHeight calculation for initial render to facilitate supporting lazily
  // loading objects like images
  // The specific containerHeight is only needed to animate the opening
  const openHeight = initialRender || !animated ? 'initial' : containerHeight;

  // Render children if they should always be rendered,
  // if not keep them rendered as long as the accordion is not fully closed
  const renderChildren =
    !removeChildrenOnClose || open || (animated && isTransitioning);

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
        <div ref={childrenWrapperRef}>{renderChildren && children}</div>
      </div>
      {triggerPosition === 'bottom' && trigger}
    </>
  );
};
