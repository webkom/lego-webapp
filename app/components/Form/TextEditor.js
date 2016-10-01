// @flow

import React from 'react';
import cx from 'classnames';
import { createField } from './Field';
import styles from './TextEditor.css';

type Props = {
  className: string
};

function TextEditor({ className, ...props }: Props) {
  return (
    <textarea
      className={cx(styles.input, className)}
      {...props}
    />
  );
}

TextEditor.Field = createField(TextEditor);
export default TextEditor;
