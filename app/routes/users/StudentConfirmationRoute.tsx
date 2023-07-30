import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  startStudentAuth,
  confirmStudentAuth,
  updateUser,
} from 'app/actions/UserActions';
import StudentConfirmation from './components/StudentConfirmation';

const StudentConfirmationRoute = (props) => {
  return <StudentConfirmation {...props} />;
};

const mapStateToProps = (state, props) => {
  return {
    isStudent: props.currentUser?.isStudent,
  };
};

const mapDispatchToProps = {
  startStudentAuth,
  confirmStudentAuth,
  updateUser,
};
export default compose(connect(mapStateToProps, mapDispatchToProps))(
  StudentConfirmationRoute
);
