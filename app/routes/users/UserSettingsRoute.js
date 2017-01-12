// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import UserSettings from './components/UserSettings';
import UserImage from './components/UserImage';
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
  handleSubmit: () => void,
  updateUser: () => void
};

class UserSettingsRoute extends Component {
  props: Props;

  onSubmit = (data) => {
    this.props.updateUser(data);
  };

  render() {
    const { handleSubmit, user } = this.props;
    return (
      <div>
        <UserImage user={user} />
        <UserSettings
          onSubmit={handleSubmit(this.onSubmit)}
          {...this.props}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const user = state.auth.username ? state.users.byId[state.auth.username] : undefined;
  return {
    user: user || {},
    initialValues: user ? {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    } : {}
  };
}

const mapDispatchToProps = { updateUser };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'contact',
    validate: validateContact
  })
)(UserSettingsRoute);
