import { Component, Fragment } from 'react';
import { Field } from 'react-final-form';
import { TextInput } from 'app/components/Form';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import type { UserEntity } from 'app/reducers/users';

type Props = {
  user: UserEntity;
  label: string;
  name: string;
};
type State = {
  password: string;
};

class PasswordField extends Component<Props, State> {
  state = {
    password: '',
  };
  static defaultProps = {
    user: {},
    label: 'Passord',
    name: 'password',
  };

  render() {
    const { name, label, user } = this.props;
    return (
      <Fragment>
        <Field
          name={name}
          type="password"
          placeholder={label}
          label={label}
          autocomplete="new-password"
          component={TextInput.Field}
          onChange={(e) =>
            this.setState({
              password: e.target.value,
            })
          }
        />
        <PasswordStrengthMeter password={this.state.password} user={user} />
      </Fragment>
    );
  }
}

export default PasswordField;
