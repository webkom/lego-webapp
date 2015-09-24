import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {connectReduxForm, initialize} from 'redux-form';
import UserSettings from '../components/UserSettings';
import { updateUser } from '../actions/UserActions';


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
  }else if (!data.email.match('.+\@.+\..+')) {
    errors.email = 'Invalid email';
  }
  return errors;
}


@connect(
  (state) => ({ user: state.auth.username ? state.users[state.auth.username] : {}}),
  { initialize, updateUser }
)
@connectReduxForm({
  form: 'contact',
  fields: ['username', 'firstName', 'lastName', 'email'],
  validate: validateContact
})
export default class UserSettingsWrapper extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired
  };
  componentWillReceiveProps(newProps) {
    if (newProps.user !== this.props.user) {
      // console.log('new user', newProps.user)
      this.props.initialize('contact', {
        username: newProps.user.username,
        firstName: newProps.user.firstName,
        lastName: newProps.user.lastName,
        email: newProps.user.email
      });
    }
  }
  componentWillMount() {
    const {user} = this.props;
    this.props.initialize('contact', {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }); // clear form
  }
  onSubmit(data) {
    // console.log('post', data);
    this.props.updateUser(data);
  }
  render() {
    const {fields, handleSubmit} = this.props;
    return (<UserSettings onSubmit={handleSubmit(::this.onSubmit)} fields={fields} />);
  }
}
