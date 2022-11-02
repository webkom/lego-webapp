import { createField } from './Field';
import styles from './PhoneNumberInput.css';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

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
