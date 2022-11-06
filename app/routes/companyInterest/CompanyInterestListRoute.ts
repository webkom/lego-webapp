import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAll,
  deleteCompanyInterest,
  fetch,
} from 'app/actions/CompanyInterestActions';
import { fetchSemesters } from 'app/actions/CompanyActions';
import CompanyInterestList from './components/CompanyInterestList';
import { selectCompanyInterestList } from 'app/store/slices/companyInterestSlice';
import { selectCompanySemestersForInterestForm } from 'app/store/slices/companySemestersSlice';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'connected-react-router';
import { semesterToText } from './utils';
import type { CompanySemesterEntity } from 'app/store/slices/companySemestersSlice';
import qs from 'qs';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const semesterId = Number(
    qs.parse(props.location.search, {
      ignoreQueryPrefix: true,
    }).semesters
  );
  const semesters = selectCompanySemestersForInterestForm(state);
  const semesterObj: CompanySemesterEntity | null | undefined = semesters.find(
    (semester) => semester.id === semesterId
  );
  const selectedOption = {
    id: semesterId ? semesterId : 0,
    semester: semesterObj != null ? semesterObj.semester : '',
    year: semesterObj != null ? semesterObj.year : '',
    label:
      semesterObj != null
        ? semesterToText({
            semester: semesterObj.semester,
            year: semesterObj.year,
            language: 'norwegian',
          })
        : 'Vis alle semestre',
  };
  const companyInterestList = selectCompanyInterestList(
    state,
    selectedOption.id
  );
  const hasMore = state.companyInterest.hasMore;
  const fetching = state.companyInterest.fetching;
  return {
    semesters,
    companyInterestList,
    hasMore,
    fetching,
    selectedOption,
  };
};

const mapDispatchToProps = {
  fetchAll,
  deleteCompanyInterest,
  fetch,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchCompanyInterestList', (_, dispatch) =>
    Promise.all([dispatch(fetchAll()), dispatch(fetchSemesters())])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestList);
