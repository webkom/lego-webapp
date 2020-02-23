// @flow

import React from 'react';
import { createField } from './Field';
import type { FormProps } from './Field';
import styles from './CheckBox.css';
import cx from 'classnames';

type Props = {
  id?: string,
  type?: string,
  label?: string,
  labelStyle?: string,
  value?: boolean,
  inverted?: boolean,
  className?: string
};

/*

When using this component as a Field in redux-form, you have to include
normalize={v => !!v}. This makes the value always end up in redux-form as
true or false, while otherwise it can end up as an empty string or left
out of the form values altogether.

Example:
<Field
  name="name"
  // label, placeholder, etc...
  component={CheckBox.Field}
  normalize={v => !!v} // <--
/>

*/

function CheckBox({
  inverted,
  id,
  label,
  value,
  labelStyle,
  className,
  ...props
}: Props) {
  const normalizedValue = inverted ? !value : value;
  return (
    <div className={cx(styles.box, className)}>
      <input
        {...props}
        defaultChecked={value}
        checked={value}
        className={cx(normalizedValue ? styles.checked : styles.unchecked)}
        type="checkbox"
      />
      <label htmlFor={id} style={labelStyle} className={styles.label}>
        {label}
      </label>
    </div>
  );
}

const RawField = createField(CheckBox);
const StyledField = ({ fieldClassName, ...props }: FormProps) => (
  <RawField
    fieldClassName={cx(fieldClassName, styles.checkboxField)}
    {...props}
  />
);
CheckBox.Field = StyledField;

export default CheckBox;
