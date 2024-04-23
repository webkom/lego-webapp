import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useMemo, useRef } from 'react';
import { createField } from './Field';
import styles from './TextInput.css';
import type { ReactNode, InputHTMLAttributes, RefObject } from 'react';

type Props = {
  type?: string;
  prefix?: ReactNode;
  suffix?: string;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  removeBorder?: boolean;
  centered?: boolean;
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
  centered = false,
  ...props
}: Props) => {
  // New ref is made because text inputs that are not Fields are not given a ref
  const newInputRef = useRef<HTMLInputElement>(null);
  // Force use of inputRef from props if set, as newInputRef does not update the inputRef and parent components thus loose access
  const ref = useMemo(() => inputRef ?? newInputRef, [inputRef, newInputRef]);

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
