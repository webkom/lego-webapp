import PhoneInput from 'react-phone-number-input';
import { createField } from './Field';
import styles from './PhoneNumberInput.module.css';
import 'react-phone-number-input/style.css';

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
