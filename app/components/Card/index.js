// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Card.css';

type Props = {
  /** Children compontents */
  children?: any,
  /** Dark background  */
  dark?: boolean,
  /** Small */
  tight?: boolean,
  /** Shadow */
  shadow?: boolean,
  /** Extra style **/
  className?: string
};

function Card({
  children,
  dark = false,
  tight = false,
  shadow = true,
  className,
  ...htmlAttributes
}: Props) {
  return (
    <div
      className={cx(
        styles.card,
        dark && styles.dark,
        tight && styles.tight,
        shadow && styles.shadow,
        className
      )}
      {...htmlAttributes}
    >
      {children}
    </div>
  );
}

export default Card;
