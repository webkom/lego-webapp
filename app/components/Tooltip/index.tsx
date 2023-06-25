import { useEffect, useState, useRef } from 'react';
import { usePopper } from 'react-popper';
import styles from './Tooltip.css';
import type { ReactNode, CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

const Tooltip = ({ children, content, className, style, onClick }: Props) => {
  const [hovered, setHovered] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const {
    styles: popperStyles,
    attributes,
    update,
  } = usePopper(triggerRef.current, tooltipRef.current, {
    placement: 'top',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['bottom', 'left', 'right'],
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
    if (hovered && update !== null) {
      update();
    }
  }, [hovered, update]);

  const tooltipClass = hovered ? styles.baseTooltipHover : styles.tooltip;

  return (
    <div
      className={className}
      style={style}
      onClick={onClick}
      ref={triggerRef}
      onMouseEnter={() => setHovered(true)}
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
