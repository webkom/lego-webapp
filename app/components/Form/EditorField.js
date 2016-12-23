// @flow
import React from 'react';
import cx from 'classnames';
import Editor from 'app/components/Editor';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  type?: string,
  className?: string
};

function EditorField({ className, input, ...rest }: Props) {
  return (<Editor
    className={cx(styles.textField, className)}
    {...input}
    {...rest}
  />);
}


EditorField.Field = createField(EditorField);
export default EditorField;
