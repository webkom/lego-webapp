// @flow

import React from 'react';
import { createField } from './Field';
import styles from './CheckBox.css';

type Props = {
  type?: string,
  label?: string,
  className?: string
};

function CheckBox({ id, label, className, ...props }: Props) {
  return (
    <div className={styles.box}>
      <input type="checkbox" id={id} {...props} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

CheckBox.Field = createField(CheckBox);
export default CheckBox;
