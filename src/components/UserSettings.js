import React, { Component, PropTypes } from 'react';

const FieldError = ({ error }) => (
  <span style={{ color: 'red', fontWeight: 'bold' }}>{error}</span>
);

export default class UserSettings extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      fields: {
        username, firstName, lastName, email
      },
      onSubmit,
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabledButton = invalid || pristine || submitting;

    return (
      <form onSubmit={onSubmit}>
        <label>Username</label>
        <input type='text' {...username} readOnly />
          {username.error && username.touched ?
            <FieldError error={username.error} /> : null}
        <br />

        <label>First name</label>
        <input type='text' {...firstName}/>
          {firstName.error && firstName.touched ?
            <FieldError error={firstName.error} /> : null}
        <br />

        <label>Last name</label>
        <input type='text' {...lastName}/>
          {lastName.error && lastName.touched ?
            <FieldError error={lastName.error} /> : null}
        <br />

        <label>Email</label>
        <input type='text' {...email}/>
          {email.error && email.touched ?
            <FieldError error={email.error} /> : null}
        <br />

        <button onClick={onSubmit} disabled={disabledButton}>Submit</button>
      </form>
    );
  }
}
