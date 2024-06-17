import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';
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
  triggerPosition = 'top',
  wrapperClassName,
  triggerComponent: TriggerComponent,
  children,
}: Props) => {
  const childrenWrapperRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(defaultOpen);
  const [initialRender, setInitialRender] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);

  const toggleOpen = () => {
    setContainerHeight(childrenWrapperRef.current?.clientHeight ?? 0);
    if (disabled) return;
    if (initialRender && animated) {
      // setOpen is triggered through useEffect to ensure proper order of actions
      setInitialRender(false);
    } else {
      setOpen(!open);
    }
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
      >
        <div ref={childrenWrapperRef}>{children}</div>
      </div>
      {triggerPosition === 'bottom' && trigger}
    </>
  );
};
