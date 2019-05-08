import React from 'react';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import { connect } from 'react-redux';
import StudentConfirmation from './components/StudentConfirmation';
import {
  sendStudentConfirmationEmail,
  confirmStudentUser
} from 'app/actions/UserActions';

const loadData = ({ location: { query: token } }, dispatch) => {
  if (token && token.token) {
    return dispatch(confirmStudentUser(token.token));
  }
};

const StudentConfirmationRoute = props => {
  return <StudentConfirmation {...props} />;
};

const mapStateToProps = (state, props) => {
  return {
    studentConfirmed: state.auth.studentConfirmed,
    isStudent: props.currentUser && props.currentUser.isStudent
  };
};

const mapDispatchToProps = {
  sendStudentConfirmationEmail
};

export default compose(
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(StudentConfirmationRoute);
