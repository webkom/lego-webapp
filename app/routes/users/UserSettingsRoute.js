// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
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
  } else if (!data.email.match(/.+@.+\..+/)) {
    errors.email = 'Invalid email';
  }

  return errors;
}

type Props = {
  user: Object,
  handleSubmit: () => void,
  initialize: () => void,
  updateUser: () => void
};

class UserSettingsRoute extends Component {
  props: Props;

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

  onSubmit = (data) => {
    this.props.updateUser(data);
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <UserSettings
        onSubmit={handleSubmit(this.onSubmit)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.username ? state.users.byId[state.auth.username] : {}
  };
}

const mapDispatchToProps = { initialize, updateUser };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'contact',
    validate: validateContact
  })
)(UserSettingsRoute);
