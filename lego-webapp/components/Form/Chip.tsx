import cx from 'classnames';
import styles from './Chip.module.css';
import { createField } from './Field';
import type { ComponentProps, InputHTMLAttributes, ReactNode } from 'react';

type Props = {
  label?: ReactNode;
  required?: boolean;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/**
 * A pill shaped alternative to RadioButton and CheckBox. Pass type="radio" for
 * a single choice group and type="checkbox" for a multiple choice one, exactly
 * as with the controls it replaces.
 *
 * The native input stays in the accessibility tree and the tab order, it is
 * only hidden visually, so the pill keeps keyboard and screen reader support.
 */
const Chip = ({ id, label, required, checked, className, ...props }: Props) => (
  <label className={cx(styles.chip, className)} htmlFor={id}>
    <input {...props} id={id} checked={checked} className={styles.input} />
    <span>{label}</span>
    {required && <span className={styles.required}>*</span>}
  </label>
);

const RawField = createField(Chip, { ownLabel: true });

const StyledField = ({
  fieldClassName,
  ...props
}: ComponentProps<typeof RawField> & { fieldClassName?: string }) => (
  <RawField fieldClassName={cx(fieldClassName, styles.chipField)} {...props} />
);

Chip.Field = StyledField;
export default Chip;
