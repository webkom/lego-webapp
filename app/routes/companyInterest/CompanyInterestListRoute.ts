import { push } from 'connected-react-router';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  fetchAll,
  deleteCompanyInterest,
  fetch as fetchCIA,
} from 'app/actions/CompanyInterestActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import CompanyInterestList from './components/CompanyInterestList';
import { getCsvUrl, semesterToText } from './utils';

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
    value: 'company_presentation',
    label: 'Bedriftspresentasjon',
  };
  const companyInterestList = selectCompanyInterestList(
    state,
    selectedSemesterOption.id
  );
  const hasMore = state.companyInterest.hasMore;
  const fetching = state.companyInterest.fetching;
  return {
    semesters,
    companyInterestList,
    hasMore,
    fetching,
    selectedSemesterOption,

    exportSurvey: async (event?: string) => {
      const blob = await fetch(
        getCsvUrl(
          selectedSemesterOption.year,
          selectedSemesterOption.semester,
          event
        ),
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        }
      ).then((response) => response.blob());
      return {
        url: URL.createObjectURL(blob),
      };
    },
  };
};

const mapDispatchToProps = {
  fetchAll,
  deleteCompanyInterest,
  fetch: fetchCIA,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchCompanyInterestList', (_, dispatch) =>
    Promise.all([dispatch(fetchAll()), dispatch(fetchSemesters())])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestList);
