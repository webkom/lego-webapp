import styles from './index.css';
import React from 'react';
import cx from 'classnames';

export { default as FieldWrapper } from './FieldWrapper';
export { default as eld } from './Field';
export { default as TextInput } from './TextInput';
export { default as TextEditor } from './TextEditor';
export { default as Button } from 'app/components/Button';

export const Form = ({
  children,
  className,
  horizontal = false,
  style,
  ...rest
}) => (
  <form
    className={cx(styles.form, className)}
    style={{
      display: 'flex',
      flexDirection: horizontal ? 'row' : 'column',
      ...style
    }}
    {...rest}
  >
    {children}
  </form>
);

export const TextField = ({ className, input, ...rest }) => (
  <textarea
    className={cx(styles.textField, className)}
    {...input}
    {...rest}
  />
);
