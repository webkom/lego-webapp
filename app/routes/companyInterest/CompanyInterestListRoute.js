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
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import prepare from 'app/utils/prepare';
import { push } from 'connected-react-router';
import { semesterToText } from './utils';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

const loadData = ({ params }, dispatch) =>
  Promise.all([dispatch(fetchAll()), dispatch(fetchSemesters())]);

const mapStateToProps = (state, props) => {
  const semesterId = Number(props.location.query.semesters);
  const semesters = selectCompanySemestersForInterestForm(state);
  const semesterObj: ?CompanySemesterEntity = semesters.find(
    semester => semester.id === semesterId
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
            language: 'norwegian'
          })
        : 'Vis alle semestre'
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
    selectedOption
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
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompanyInterestList);
