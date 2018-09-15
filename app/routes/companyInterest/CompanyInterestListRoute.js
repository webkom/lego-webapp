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

const loadData = ({ params }, dispatch) =>
  Promise.all([
    dispatch(fetchAll()).catch(),
    dispatch(fetchSemesters()).catch()
  ]);

const mapStateToProps = (state, props) => {
  const { semester, year } = props.location.query;
  let selectedOption = {
    semester: semester ? semester : '',
    year: year ? year : ''
  };
  const companyInterestList = selectCompanyInterestList(state, selectedOption);
  // TODO: Add filter in selector
  const semesters = selectCompanySemesters(state);
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
      label: label === undefined ? label : 'Vis alle semestre'
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
