// @flow

import React from 'react';
import { createField } from './Field';
import styles from './CheckBox.css';
import cx from 'classnames';

type Props = {
  id: string,
  type?: string,
  label?: string,
  value?: boolean,
  className?: string
};

function CheckBox({
  id,
  label,
  value,
  labelStyle,
  className,
  ...props
}: Props) {
  return (
    <div className={styles.box}>
      <input
        {...props}
        className={cx(value ? styles.checked : styles.unchecked)}
        type="checkbox"
        id={id}
        checked={value}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
}

CheckBox.Field = createField(CheckBox);
export default CheckBox;
