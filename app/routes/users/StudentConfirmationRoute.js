import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import qs from 'qs';
import { compose } from 'redux';

import {
  confirmStudentUser,
  sendStudentConfirmationEmail,
} from 'app/actions/UserActions';
import prepare from 'app/utils/prepare';
import StudentConfirmation from './components/StudentConfirmation';

const loadData = ({ location: { search } }, dispatch) => {
  const { token } = qs.parse(search, { ignoreQueryPrefix: true });
  if (token) {
    return dispatch(confirmStudentUser(token));
  }
};

const StudentConfirmationRoute = (props) => {
  return <StudentConfirmation {...props} />;
};

const mapStateToProps = (state, props) => {
  return {
    studentConfirmed: state.auth.studentConfirmed,
    isStudent: props.currentUser && props.currentUser.isStudent,
  };
};

const mapDispatchToProps = {
  sendStudentConfirmationEmail,
  push,
};

export default compose(
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(StudentConfirmationRoute);
