// @flow
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import qs from 'qs';
import { compose } from 'redux';

import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  deleteCompanyInterest,
  fetch,
  fetchAll,
} from 'app/actions/CompanyInterestActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import CompanyInterestList from './components/CompanyInterestList';
import { semesterToText } from './utils';

const loadData = ({ match: { params } }, dispatch) =>
  Promise.all([dispatch(fetchAll()), dispatch(fetchSemesters())]);

const mapStateToProps = (state, props) => {
  const semesterId = Number(
    qs.parse(props.location.search, { ignoreQueryPrefix: true }).semesters
  );
  const semesters = selectCompanySemestersForInterestForm(state);
  const semesterObj: ?CompanySemesterEntity = semesters.find(
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
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestList);
