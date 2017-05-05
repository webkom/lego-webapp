// @flow

import React from 'react';
import { createField } from './Field';
import styles from './RadioButton.css';

type Props = {
  type?: string,
  label?: string,
  className?: string
};

function RadioButton({ id, label, inputValue, className, ...props }: Props) {
  return (
    <div className={styles.box}>
      <input {...props} type="radio" id={id} value={inputValue} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

RadioButton.Field = createField(RadioButton);
export default RadioButton;
