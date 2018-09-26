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
import { push } from 'react-router-redux';
import { semesterToText } from './utils';

const loadData = ({ params }, dispatch) =>
  Promise.all([dispatch(fetchAll()), dispatch(fetchSemesters())]);

const mapStateToProps = (state, props) => {
  const semesterIds = [...(props.location.query.semesters || [])];
  const semesters = selectCompanySemestersForInterestForm(state);
  const semesterObjects =
    semesterIds.length > 0
      ? semesterIds
          .filter(Boolean)
          .map(id => semesters.find(semester => semester.id === Number(id)))
      : [];

  const selectedOptions = semesterObjects.filter(Boolean).map(semesterObj => {
    let { id, semester, year } = semesterObj;
    return {
      value: semesterIds ? id : 0,
      semester: semesterObj != null ? semester : '',
      year: semesterObj != null ? year : '',
      label:
        semesterObj != null
          ? semesterToText({
              semester: semesterObj.semester,
              year: semesterObj.year
            })
          : 'Vis alle semestre'
    };
  });

  const companyInterestList = selectCompanyInterestList(state, semesterIds);
  const hasMore = state.companyInterest.hasMore;
  const fetching = state.companyInterest.fetching;
  return {
    semesters,
    companyInterestList,
    hasMore,
    fetching,
    selectedOptions
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
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestList);
