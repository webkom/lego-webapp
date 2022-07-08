// @flow

import PhoneInput from 'react-phone-number-input';

import { createField } from './Field';

import 'react-phone-number-input/style.css';
import styles from './PhoneNumberInput.css';

const PhoneNumberInput = ({ ...props }: any) => {
  return (
    <PhoneInput
      {...props}
      international
      className={styles.input}
      defaultCountry="NO"
    />
  );
};

PhoneNumberInput.Field = createField(PhoneNumberInput);
export default PhoneNumberInput;
