// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAll,
  deleteCompanyInterest,
  fetch
} from 'app/actions/CompanyInterestActions';
import { fetchSemesters } from 'app/actions/CompanyActions';
import CompanyInterestList from './components/CompanyInterestList';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import prepare from 'app/utils/prepare';
import { push } from 'react-router-redux';
import { semesterToText } from './utils';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

const loadData = ({ params }, dispatch) =>
  Promise.all([
    dispatch(fetchAll()).catch(),
    dispatch(fetchSemesters()).catch()
  ]);

const mapStateToProps = (state, props) => {
  const semesterId = Number(props.location.query.semesters);
  const semesters = selectCompanySemesters(state);
  let semesterObj: ?CompanySemesterEntity = semesters.find(
    semester => semester.id === semesterId
  );

  let selectedOption = {
    id: semesterId != null ? semesterId : 0,
    semester: semesterObj != null ? semesterObj.semester : '',
    year: semesterObj != null ? semesterObj.year : ''
  };
  const companyInterestList = selectCompanyInterestList(state, selectedOption);
  // TODO: Add filter in selector
  const hasMore = state.companyInterest.hasMore;
  const fetching = state.companyInterest.fetching;

  let label = semesterToText(selectedOption);
  return {
    semesters,
    companyInterestList,
    hasMore,
    fetching,
    selectedOption: {
      ...selectedOption,
      label: label != null ? label : 'Vis alle semestre'
    }
  };
};

const mapDispatchToProps = {
  fetchAll,
  deleteCompanyInterest,
  fetch,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['']),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestList);
