import { useState } from 'react';
import { Field } from 'react-final-form';
import { TextInput } from 'app/components/Form';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import type { User } from 'app/store/models/User';

export type PasswordFieldUser = Partial<
  Pick<User, 'username' | 'firstName' | 'lastName'>
>;

type Props = {
  user: PasswordFieldUser;
  name?: string;
  label?: string;
};

const PasswordField = ({
  user,
  name = 'password',
  label = 'Passord',
}: Props) => {
  const [password, setPassword] = useState('');

  return (
    <>
      <Field
        name={name}
        type="password"
        placeholder={label}
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
