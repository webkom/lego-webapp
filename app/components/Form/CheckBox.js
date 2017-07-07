// @flow

import React from 'react';
import { createField } from './Field';
import styles from './CheckBox.css';

type Props = {
  id: string,
  type?: string,
  label?: string,
  value?: boolean,
  className?: string
};

function CheckBox({ id, label, value, className, ...props }: Props) {
  return (
    <div className={styles.box}>
      <input {...props} type="checkbox" id={id} checked={value} />
      <label htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

CheckBox.Field = createField(CheckBox);
export default CheckBox;
