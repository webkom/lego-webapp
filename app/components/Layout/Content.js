import React from 'react';
import cx from 'classnames';
import styles from './Content.css';

function Content({ children, className, ...htmlAttributes }) {
  return (
    <div className={cx(styles.content, className)} {...htmlAttributes}>
      {children}
    </div>
  );
}

export default Content;
