import cx from 'classnames';
import type { Event } from 'app/models';
import { eventTypeToString } from 'app/routes/events/utils';
import styles from './ContentHeader.module.css';
import type { HTMLAttributes, ReactNode } from 'react';

type Props = {
  className?: string;
  borderColor?: string;
  children: ReactNode;
  event?: Event;
  color?: string;
} & HTMLAttributes<HTMLDivElement>;

const DEFAULT_BORDER_COLOR = '#FCD748';

/**
 * Provides a simple header with a fat bottom border in the given color.
 */
function ContentHeader({
  children,
  className,
  borderColor = DEFAULT_BORDER_COLOR,
  event,
  ...props
}: Props) {
  return (
    <div
      style={{
        borderColor,
      }}
      className={cx(styles.header, className)}
      {...props}
    >
      <h2>{children}</h2>
      {event && (
        <strong
          style={{
            color: borderColor,
          }}
          className={styles.eventType}
        >
          {eventTypeToString(event.eventType)}
        </strong>
      )}
    </div>
  );
}

export default ContentHeader;
