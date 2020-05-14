// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Form.css';

type Props = {
  children: any,
  className?: string,
};

function Form({ children, className, ...props }: Props) {
  return (
    <form className={cx(styles.form, className)} {...props} method="post">
      {children}
    </form>
  );
}

export default Form;
