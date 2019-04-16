import React from 'react';
import cx from 'classnames';
import { createField } from './Field';
import styles from './TextEditor.css';

interface Props {
  className: string;
  rich?: boolean;
}

/**
 * TextEditor
 *
 * @todo: This component should eventually provide a draft.js based editor,
 * but for now it is only a textarea.
 */
function TextEditor({ className, ...props }: Props) {
  return <textarea className={cx(styles.input, className)} {...props} />;
}

TextEditor.Field = createField(TextEditor);
export default TextEditor;
