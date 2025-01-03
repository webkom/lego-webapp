import { useState } from 'react';
import { Field } from 'react-final-form';
import { TextInput } from 'app/components/Form';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import type { PublicUser } from 'app/store/models/User';

export type PasswordFieldUser = Partial<
  Pick<PublicUser, 'username' | 'firstName' | 'lastName'>
>;

type Props = {
  user?: PasswordFieldUser;
  name?: string;
  label?: string;
  placeholder?: string;
};

const PasswordField = ({
  user,
  name = 'password',
  label = 'Passord',
  placeholder = 'passord123',
}: Props) => {
  const [password, setPassword] = useState('');

  return (
    <>
      <Field
        name={name}
        type="password"
        placeholder={placeholder}
        label={label}
        autocomplete="new-password"
        component={TextInput.Field}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordStrengthMeter password={password} user={user} />
    </>
  );
};

export default PasswordField;
