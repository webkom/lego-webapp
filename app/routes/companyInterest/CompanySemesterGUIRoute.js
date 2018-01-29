import { connect } from 'react-redux';
import { compose } from 'redux';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { LoginPage } from 'app/components/LoginForm';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import { sortSemesterChronologically } from './utils.js';
import { addSemester, editSemester } from 'app/actions/CompanyActions';
import CompanySemesterGUI from './components/CompanySemesterGUI';
import { fetchSemestersForInterestform } from 'app/actions/CompanyActions';

const loadSemesters = (props, dispatch) =>
  dispatch(fetchSemestersForInterestform());

const mapStateToProps = state => {
  const semesters = selectCompanySemestersForInterestForm(state);
  return {
    semesters: semesters.sort(sortSemesterChronologically)
  };
};

const mapDispatchToProps = {
  addSemester,
  editSemester
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadSemesters),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanySemesterGUI);
