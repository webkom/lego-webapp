import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  addSemester,
  editSemester,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectCompanySemesters,
  selectCompanySemestersForInterestForm,
} from 'app/reducers/companySemesters';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import CompanySemesterGUI from './components/CompanySemesterGUI';

const mapStateToProps = (state) => {
  const semesters = selectCompanySemesters(state);
  const activeSemesters = selectCompanySemestersForInterestForm(state);
  return {
    initialValues: {
      semester: 'spring',
    },
    semesters,
    activeSemesters,
  };
};

const mapDispatchToProps = {
  addSemester,
  editSemester,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchCompanySemesterGUI', (props, dispatch) =>
    dispatch(fetchSemesters()),
  ),
  connect(mapStateToProps, mapDispatchToProps),
)(CompanySemesterGUI);
