import React from 'react';
import cx from 'classnames';
import { createField } from './Field';
import Textarea from 'react-textarea-autosize';
import styles from './TextInput.css';

interface Props {
  type?: string;
  className?: string;
  inputRef?: any;
  readOnly?: boolean;
}

function TextArea({
  type = 'text',
  className,
  inputRef,
  readOnly,
  ...props
}: Props) {
  return (
    <Textarea
      ref={inputRef}
      type={type}
      className={cx(styles.input, readOnly && styles.disabled, className)}
      {...props}
    />
  );
}

TextArea.Field = createField(TextArea);
export default TextArea;
