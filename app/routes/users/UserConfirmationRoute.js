import React from 'react';
import { dispatched } from 'react-prepare';
import { compose } from 'redux';
import { connect } from 'react-redux';
import UserConfirmation from './components/UserConfirmation';
import { createUser, validateRegistrationToken } from 'app/actions/UserActions';

const loadData = ({ location: { query: token } }, dispatch) =>
  dispatch(validateRegistrationToken(token));

const UserConfirmationRoute = props => {
  return <UserConfirmation {...props} />;
};

const mapStateToProps = (state, props) => {
  return { token: state.auth.registrationToken };
};

const mapDispatchToProps = {
  createUser
};

export default compose(
  dispatched(loadData, { componentWillReceiveProps: false }),
  connect(mapStateToProps, mapDispatchToProps)
)(UserConfirmationRoute);
