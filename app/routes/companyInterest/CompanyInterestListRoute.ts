import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'redux-first-history';
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
import { EVENT_TYPE_OPTIONS } from './components/CompanyInterestPage';
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
  const eventValue = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  }).event;
  const selectedSemesterOption = {
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
  const selectedEventOption = {
    value: eventValue ? eventValue : '',
    label: eventValue
      ? EVENT_TYPE_OPTIONS.find((eventType) => eventType.value === eventValue)
          .label
      : 'Vis alle arrangementstyper',
  };
  const companyInterestList = selectCompanyInterestList(
    state,
    selectedSemesterOption.id,
    selectedEventOption.value
  );
  const hasMore = state.companyInterest.hasMore;
  const fetching = state.companyInterest.fetching;

  return {
    semesters,
    companyInterestList,
    hasMore,
    fetching,
    selectedSemesterOption,
    selectedEventOption,
    authToken: state.auth.token,
  };
};

const mapDispatchToProps = {
  fetchAll,
  deleteCompanyInterest,
  fetch,
  replace,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchCompanyInterestList', (_, dispatch) =>
    Promise.all([dispatch(fetchAll()), dispatch(fetchSemesters())])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestList);
