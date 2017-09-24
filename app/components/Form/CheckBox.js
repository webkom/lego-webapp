// @flow

import React from 'react';
import { createField } from './Field';
import styles from './CheckBox.css';
import cx from 'classnames';

type Props = {
  id: string,
  type?: string,
  label?: string,
  labelStyle?: string,
  value?: boolean,
  className?: string
};

/*

When using this component as a Field in redux-form, you have to include
normalize={v => !!v}. This makes the value always end up in redux-form as
true or false, while otherwise it can end up as an empty string or left
out of the firn values altogether.

Example:
<Field
  name="name"
  // label, placeholder, etc...
  component={CheckBox.Field}
  normalize={v => !!v} // <--
/>

*/

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
      />
      <label htmlFor={id} style={labelStyle} className={styles.label}>
        {label}
      </label>
    </div>
  );
}

CheckBox.Field = createField(CheckBox);
export default CheckBox;
