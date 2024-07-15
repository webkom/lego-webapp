import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useMemo, useRef, useState } from 'react';
import { createField } from './Field';
import styles from './TextInput.css';
import type { RefObject, InputHTMLAttributes } from 'react';
import type { Overwrite } from 'utility-types';

type Props = {
  type?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  removeBorder?: boolean;
  centered?: boolean;
} & Overwrite<
  InputHTMLAttributes<HTMLInputElement>,
  {
    value?: string;
  }
>;

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
  centered = false,
  ...props
}: Props) => {
  // New ref is made because text inputs that are not Fields are not given a ref
  const newInputRef = useRef<HTMLInputElement>(null);
  // Force use of inputRef from props if set, as newInputRef does not update the inputRef and parent components thus loose access
  const ref = useMemo(() => inputRef ?? newInputRef, [inputRef, newInputRef]);

  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
        centered && styles.centered,
        className,
      )}
    >
      {prefix && (
        <div
          onClick={() => ref.current && ref.current.focus()}
          className={styles.prefix}
        >
          <Icon name={prefix} size={16} />
        </div>
      )}
      <input
        ref={ref}
        type={isPasswordField && showPassword ? 'text' : type}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={!!readOnly}
        {...props}
      />
      {isPasswordField && (
        <Icon
          onClick={togglePasswordVisibility}
          name={showPassword ? 'eye-off' : 'eye'}
          size={16}
          className={styles.togglePasswordVisibility}
        />
      )}
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </Flex>
  );
};

TextInput.Field = createField(TextInput);
export default TextInput;
