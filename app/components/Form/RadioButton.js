// @flow

import React from 'react';
import { createField } from './Field';
import './RadioButton.css';

type Props = {
  type?: string,
  label?: string,
  className?: string
};

function RadioButton({ id, label, className, ...props }: Props) {
  return (
    <div className={className}>
      <input
        type='radio'
        id={id}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

RadioButton.Field = createField(RadioButton);
export default RadioButton;
