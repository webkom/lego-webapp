import cx from 'classnames';
import { useState, useRef, useEffect } from 'react';
import styles from './Tooltip.css';
import type { ReactNode, CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  list?: boolean;
  renderDirection?: string;
  pointerPosition?: string;
};

/**
 * A tooltip that appears when you hover over the component placed within.
 * The tooltip will by default be centered, however it supports a 'renderDirection'
 * prop that will make it render either to the left or the right from the postion of the pointer. The pointer
 * (the small arrow that points towards the component within the tooltip) will
 * also default to center, and it can be adjusted with the 'pointerPosition' prop.
 * Both props can be set as either 'left' or 'right'.
 */
const Tooltip = ({
  children,
  content,
  className,
  list = false,
  style,
  onClick,
  renderDirection,
  pointerPosition,
}: Props) => {
  const [hovered, setHovered] = useState(false);
  const [childrenContainerWidth, setChildrenContainerWidth] = useState(0);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const measure = () => {
    if (tooltipRef.current) {
      setChildrenContainerWidth(tooltipRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    measure();
  }, []);

  let renderDirectionClass = styles.renderFromCenter;
  let startPointChildren = 2;

  if (!list) {
    switch (renderDirection) {
      case 'left':
        renderDirectionClass = styles.renderDirectionLeft;
        break;

      case 'right':
        renderDirectionClass = styles.renderDirectionRight;
        break;

      default:
        break;
    }

    switch (pointerPosition) {
      case 'left':
        startPointChildren = 9;
        break;

      case 'right':
        startPointChildren = 10 / 9;
        break;

      default:
        break;
    }
  }

  const tooltipClass = hovered ? styles.baseTooltipHover : styles.tooltip;
  const tooltip = list ? styles.listTooltip : styles.showTooltip;
  return (
    <div className={className} onClick={onClick}>
      <div
        ref={tooltipRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={cx(tooltipClass, tooltip, renderDirectionClass)}
          style={{
            ...style,
            marginLeft: childrenContainerWidth / startPointChildren - 5,
          }}
        >
          {content}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Tooltip;
