export { default as TextInput } from './TextInput';
export { default as TextEditor } from './TextEditor';
export { default as DatePicker } from './DatePicker';
export { default as Button } from 'app/components/Button';
export { default as Form } from './Form';
export { default as Field } from './Field';
export { default as TimePicker } from './TimePicker';
export { createField } from './Field';
import styles from './index.css';
import React from 'react';
import cx from 'classnames';
import Editor from 'app/components/Editor';

export { default as FieldWrapper } from './FieldWrapper';

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

export const EditorField = ({ className, input, ...rest }) => (
  <Editor
    className={cx(styles.textField, className)}
    {...input}
    {...rest}
  />
);
