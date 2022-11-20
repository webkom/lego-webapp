import cx from 'classnames';
import { createField } from './Field';
import styles from './RadioButton.css';
import type { FormProps } from './Field';
import type { InputHTMLAttributes } from 'react';

type Props = {
  id: string;
  type?: string;
  label?: string;
  className?: string;
  inputValue?: string;
  checked?: boolean;
  value?: string | number;
} & InputHTMLAttributes<HTMLInputElement>;

function RadioButton({
  id,
  label,
  inputValue,
  checked,
  className,
  value,
  ...props
}: Props) {
  // TODO: Remove this when redux-form is gone
  checked = inputValue ? inputValue === value : checked;
  value = inputValue ?? value;
  return (
    <div className={cx(styles.box, className)}>
      <input
        {...props}
        className={styles.input}
        checked={checked}
        type="radio"
        id={id}
        value={value}
      />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

const RawField = createField(RadioButton);

const StyledField = ({ fieldClassName, ...props }: FormProps) => (
  <RawField fieldClassName={cx(fieldClassName, styles.radioField)} {...props} />
);

RadioButton.Field = StyledField;
export default RadioButton;
