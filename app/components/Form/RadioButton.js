// @flow

import React from 'react';
import { createField } from './Field';
import './RadioButton.css';

type Props = {
  type?: string,
  label?: string,
  className?: string
};

function RadioButton({ label, className, ...props }: Props) {
  return (
    <div className={className}>
      <input
        type='radio'
        id={label}
        {...props}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
}

RadioButton.Field = createField(RadioButton);
export default RadioButton;
