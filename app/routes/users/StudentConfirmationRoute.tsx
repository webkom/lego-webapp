import React from 'react';
import { dispatched } from '@webkom/react-prepare';
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
  dispatched(loadData, { componentWillReceiveProps: false }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(StudentConfirmationRoute);
