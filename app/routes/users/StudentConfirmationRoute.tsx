import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  sendStudentConfirmationEmail,
  confirmStudentUser,
  startStudentAuth,
  confirmStudentAuth,
  updateUser,
} from 'app/actions/UserActions';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import StudentConfirmation from './components/StudentConfirmation';

const loadData = ({ location: { search } }, dispatch) => {
  const { token } = qs.parse(search, {
    ignoreQueryPrefix: true,
  });

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
  startStudentAuth,
  confirmStudentAuth,
  sendStudentConfirmationEmail,
  updateUser,
};
export default compose(
  withPreparedDispatch('fetchStudentConfirmation', loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(StudentConfirmationRoute);
