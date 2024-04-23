import cx from 'classnames';
import PhoneInput from 'react-phone-number-input';
import { createField } from './Field';
import styles from './TextInput.css';
import 'react-phone-number-input/style.css';

const PhoneNumberInput = ({ ...props }: any) => {
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
