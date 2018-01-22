import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { LoginPage } from 'app/components/LoginForm';
import selectCompanySemestersForInterestForm from 'app/reducers/companySemesters';
import { sortSemesterChronologically } from './utils.js';

import {
  addSemester,
  deleteSemester,
  fetchSemesters
} from 'app/actions/CompanyActions';
import CompanySemesterGUI from './components/CompanySemesterGUI';

const mapStateToProps = (state, props) => {
  const semesters = selectCompanySemestersForInterestForm(state, props);
  return {
    semesters: semesters.sort(sortSemesterChronologically)
  };
};

const mapDispatchToProps = {
  addSemester,
  deleteSemester
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare((props, dispatch) => dispatch(fetchSemesters)),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addSemester',
    validate: 'validateSemesterStatus',
    enableReinitialize: true
  })
)(CompanySemesterGUI);
