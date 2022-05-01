// @flow

import { createField } from './Field';
import type { FormProps } from './Field';
import styles from './CheckBox.css';
import cx from 'classnames';

type Props = {
  id?: string,
  type?: string,
  label?: string,
  labelStyle?: string,
  value?: boolean,
  checked?: boolean,
  inverted?: boolean,
  className?: string,
};

/*

When using this component as a Field in form, you have to include
type="checkbox", so that react-final-form knows to send the "checked" prop.

*/

function CheckBox({
  inverted,
  id,
  label,
  value, // TODO: remove "value" once migration to react-final-form is complete
  checked,
  labelStyle,
  className,
  ...props
}: Props) {
  checked = checked ?? value;
  const normalizedValue = inverted ? !checked : checked;
  return (
    <div className={cx(styles.box, className)}>
      <input
        {...props}
        checked={checked}
        className={cx(normalizedValue ? styles.checked : styles.unchecked)}
        type="checkbox"
      />
      <label htmlFor={id} style={labelStyle} className={styles.label}>
        {label}
      </label>
    </div>
  );
}

const RawField = createField(CheckBox);
const StyledField = ({ fieldClassName, ...props }: FormProps) => (
  <RawField
    fieldClassName={cx(fieldClassName, styles.checkboxField)}
    {...(props: Object)}
  />
);
CheckBox.Field = StyledField;

export default CheckBox;
