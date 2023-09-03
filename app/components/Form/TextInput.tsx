import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useRef } from 'react';
import { createField } from './Field';
import styles from './TextInput.css';
import type { ReactNode, InputHTMLAttributes } from 'react';

type Props = {
  type?: string;
  prefix?: ReactNode;
  suffix?: string;
  className?: string;
  inputRef?: HTMLInputElement;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  removeBorder?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({
  type = 'text',
  className,
  disabled,
  inputRef,
  prefix,
  suffix,
  readOnly,
  placeholder,
  removeBorder = false,
  ...props
}: Props) => {
  /* New ref is made because text inputs that are not Fields are not given a ref */
  const newInputRef = useRef<HTMLInputElement>(inputRef);

  return (
    <Flex
      alignItems="center"
      gap={10}
      className={cx(
        styles.input,
        styles.textInput,
        disabled && styles.disabled,
        !prefix && styles.spacing,
        removeBorder && styles.removeBorder,
        className
      )}
    >
      {prefix && (
        <Icon
          name={prefix}
          size={16}
          onClick={() => newInputRef.current.focus()}
          className={styles.prefix}
        />
      )}
      <input
        ref={newInputRef}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={!!readOnly}
        {...props}
      />
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </Flex>
  );
};

TextInput.Field = createField(TextInput);
export default TextInput;
