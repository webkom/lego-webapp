import { replace } from 'connected-react-router';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  deleteCompanyInterest,
  fetch,
} from 'app/actions/CompanyInterestActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import { selectPaginationNext } from 'app/reducers/selectors';
import type { RootState } from 'app/store/createRootReducer';
import { EntityType } from 'app/store/models/entities';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import CompanyInterestList from './components/CompanyInterestList';
import { EVENT_TYPE_OPTIONS } from './components/CompanyInterestPage';
import { semesterToText } from './utils';

const mapStateToProps = (state: RootState, props) => {
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const semesterId = Number(query.semesters);
  const semesters = selectCompanySemestersForInterestForm(state);
  const semesterObj = semesters.find((semester) => semester.id === semesterId);
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
          ?.label
      : 'Vis alle arrangementstyper',
  };
  const companyInterestList = selectCompanyInterestList(
    state,
    selectedSemesterOption.id,
    selectedEventOption.value as string
  );
  const hasMore = selectPaginationNext({
    endpoint: '/company-interests/',
    query,
    entity: EntityType.CompanyInterests,
  })(state).pagination.hasMore;
  const fetching = state.companyInterest.fetching;

  console.log(query);

  return {
    query,
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
  deleteCompanyInterest,
  fetch,
  replace,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps),
  withPreparedDispatch('fetchCompanyInterestList', ({ query }, dispatch) =>
    Promise.all([dispatch(fetch({ query })), dispatch(fetchSemesters())])
  )
)(CompanyInterestList);
