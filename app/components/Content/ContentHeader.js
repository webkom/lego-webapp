// @flow

import type { Node } from 'react';
import cx from 'classnames';
import styles from './ContentHeader.css';

type Props = {
  className?: string,
  borderColor?: string,
  children: Node,
};

const DEFAULT_BORDER_COLOR = '#FCD748';

/**
 * Provides a simple header with a fat bottom border in the given color.
 */
function ContentHeader({
  children,
  className,
  borderColor = DEFAULT_BORDER_COLOR,
  ...props
}: Props) {
  return (
    <h2
      style={{ borderColor }}
      className={cx(styles.header, className)}
      {...(props: Object)}
    >
      {children}
    </h2>
  );
}

export default ContentHeader;
