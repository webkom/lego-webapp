import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, initialize } from 'redux-form';
import UserSettings from './components/UserSettings';
import { updateUser } from 'app/actions/UserActions';


function validateContact(data) {
  const errors = {};
  if (!data.username) {
    errors.username = 'Required';
  }

  if (!data.firstName) {
    errors.firstName = 'Required';
  }

  if (!data.lastName) {
    errors.lastName = 'Required';
  }

  if (!data.email) {
    errors.email = 'Required';
  } else if (!data.email.match('.+\@.+\..+')) {
    errors.email = 'Invalid email';
  }

  return errors;
}


@reduxForm({
  form: 'contact',
  validate: validateContact
})
@connect(
  (state) => ({ user: state.auth.username ? state.users.byId[state.auth.username] : {} }),
  { initialize, updateUser }
)
export default class UserSettingsRoute extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired
  };

  componentWillReceiveProps(newProps) {
    if (newProps.user !== this.props.user) {
      const data = {
        username: newProps.user.username,
        firstName: newProps.user.firstName,
        lastName: newProps.user.lastName,
        email: newProps.user.email
      };

      this.props.initialize('contact', data);
    }
  }

  componentWillMount() {
    const { user } = this.props;
    const data = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    this.props.initialize('contact', data);
  }

  onSubmit(data) {
    this.props.updateUser(data);
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <UserSettings
        onSubmit={handleSubmit(::this.onSubmit)}
        {...this.props}
      />
    );
  }
}
