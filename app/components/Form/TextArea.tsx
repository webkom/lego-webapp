import cx from 'classnames';
import Textarea from 'react-textarea-autosize';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  className?: string;
  inputRef?: any;
  readOnly?: boolean;
} & Parameters<typeof Textarea>;

function TextArea({ className, inputRef, readOnly, ...props }: Props) {
  return (
    <Textarea
      ref={inputRef}
      className={cx(styles.input, readOnly && styles.disabled, className)}
      {...props}
    />
  );
}

TextArea.Field = createField(TextArea);
export default TextArea;
