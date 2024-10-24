import cx from 'classnames';
import PhoneInput from 'react-phone-number-input';
import { createField } from './Field';
import styles from './TextInput.module.css';
import 'react-phone-number-input/style.css';
import type { ComponentProps } from 'react';

const PhoneNumberInput = (props: ComponentProps<typeof PhoneInput>) => {
  return (
    <PhoneInput
      {...props}
      international
      className={cx(styles.input, styles.textInput, styles.phoneNumberInput)}
      defaultCountry="NO"
    />
  );
};

PhoneNumberInput.Field = createField(PhoneNumberInput);
export default PhoneNumberInput;
