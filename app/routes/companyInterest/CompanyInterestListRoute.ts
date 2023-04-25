import { push } from 'connected-react-router';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  fetchAll,
  deleteCompanyInterest,
  fetch,
} from 'app/actions/CompanyInterestActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import CompanyInterestList from './components/CompanyInterestList';
import { semesterToText } from './utils';

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
