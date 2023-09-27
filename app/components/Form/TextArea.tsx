import cx from 'classnames';
import Textarea from 'react-textarea-autosize';
import { createField } from './Field';
import styles from './TextEditor.css';
import type { ComponentProps, RefObject } from 'react';

type Props = {
  className?: string;
  inputRef?: RefObject<HTMLTextAreaElement>;
  readOnly?: boolean;
} & ComponentProps<typeof Textarea>;

function TextArea({ className, inputRef, readOnly, ...props }: Props) {
  return (
    <Textarea
      ref={inputRef}
      className={cx(styles.input, readOnly, className)}
      {...props}
    />
  );
}

TextArea.Field = createField(TextArea);
export default TextArea;
