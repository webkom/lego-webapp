import { useEffect, useState, useRef } from 'react';
import { usePopper } from 'react-popper';
import styles from './Tooltip.css';
import type { ReactNode, CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  onClick?: () => void;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  style?: CSSProperties;
  disabled?: boolean;
};

const Tooltip = ({
  children,
  content,
  className,
  onClick,
  placement,
  style,
  disabled,
}: Props) => {
  const [hovered, setHovered] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const {
    styles: popperStyles,
    attributes,
    update,
  } = usePopper(triggerRef.current, tooltipRef.current, {
    placement: placement || 'top',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['top', 'bottom', 'left', 'right'],
        },
      },
      {
        name: 'arrow',
        options: {
          element: arrowRef.current,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  useEffect(() => {
    if (hovered && !disabled && update !== null) {
      update();
    }
  }, [hovered, disabled, update]);

  const tooltipClass = hovered ? styles.baseTooltipHover : styles.tooltip;

  return (
    <div
      className={className}
      style={style}
      onClick={onClick}
      ref={triggerRef}
      onMouseEnter={() => setHovered(!disabled && true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <div
        ref={tooltipRef}
        style={popperStyles.popper}
        {...attributes.popper}
        className={tooltipClass}
      >
        <div className={styles.content}>{content}</div>
        <div
          ref={arrowRef}
          style={{
            ...popperStyles.arrow,
          }}
          {...attributes.arrow}
          className={styles.arrow}
        />
      </div>
    </div>
  );
};

export default Tooltip;
