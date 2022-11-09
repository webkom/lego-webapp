import cx from 'classnames';
import Textarea from 'react-textarea-autosize';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  type?: string;
  className?: string;
  inputRef?: any;
  readOnly?: boolean;
};

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
      {...(props as Record<string, any>)}
    />
  );
}

TextArea.Field = createField(TextArea);
export default TextArea;
