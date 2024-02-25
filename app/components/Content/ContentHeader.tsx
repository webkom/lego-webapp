import cx from 'classnames';
import { displayNameForEventType } from 'app/routes/events/utils';
import styles from './ContentHeader.css';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from 'app/store/models/Event';
import type { HTMLAttributes, ReactNode } from 'react';

type Props = {
  className?: string;
  borderColor?: string;
  children: ReactNode;
  event?: AuthUserDetailedEvent | UserDetailedEvent;
  color?: string;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Provides a simple header with a fat bottom border in the given color.
 */
function ContentHeader({
  children,
  className,
  borderColor,
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
          {displayNameForEventType(event.eventType)}
        </strong>
      )}
    </div>
  );
}

export default ContentHeader;
