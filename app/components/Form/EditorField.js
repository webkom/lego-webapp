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

function EditorField({ className, ...props }: Props) {
  return (<Editor
    className={cx(styles.textField, className)}
    {...props}
    {...props.input}
    {...props.meta}
  />);
}


EditorField.Field = createField(EditorField);
export default EditorField;
