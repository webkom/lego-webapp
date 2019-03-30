// @flow
import React from 'react';
import cx from 'classnames';
import Editor from 'app/components/Editor';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  type?: string,
  className?: string,
  input: any,
  meta: any,
  name: string
};

class NoSSRError {
  error: Error;
  constructor(msg) {
    this.error = new Error(msg);
  }
}

function EditorField({ className, name, ...props }: Props) {
  if (!__CLIENT__) {
    throw new NoSSRError('Cannot SSR editor');
  }
  return (
    <div name={name}>
      <Editor {...props} {...props.input} {...props.meta} />
    </div>
  );
}

EditorField.Field = createField(EditorField);
export default EditorField;
