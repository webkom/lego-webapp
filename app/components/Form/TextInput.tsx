import cx from 'classnames';
import { createField } from './Field';
import styles from './TextInput.css';
import type { RefObject, InputHTMLAttributes } from 'react';

type Props = {
  type?: string;
  suffix?: string;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
  disabled?: boolean;
  readOnly?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

function TextInput({
  type = 'text',
  className,
  disabled,
  inputRef,
  suffix,
  readOnly,
  ...props
}: Props) {
  return (
    <span className={cx(suffix && styles.inputGroup)}>
      <input
        ref={inputRef}
        type={type}
        disabled={disabled}
        readOnly={!!readOnly}
        className={cx(styles.input, suffix && styles.suffix, className)}
        {...props}
      />
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </span>
  );
}

TextInput.Field = createField(TextInput);
export default TextInput;
