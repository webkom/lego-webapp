import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import {
  fetchAdmin,
  deleteSemesterStatus,
  deleteCompanyContact,
  fetchSemesters,
  editSemesterStatus,
  fetchEventsForCompany,
  editCompany,
  deleteCompany,
} from 'app/actions/CompanyActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectCompanyById,
  selectEventsForCompany,
  selectCommentsForCompany,
} from 'app/reducers/companies';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { selectPagination } from 'app/reducers/selectors';
import createQueryString from 'app/utils/createQueryString';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import BdbDetail from './components/BdbDetail';

const queryString = (companyId) =>
  createQueryString({
    company: companyId,
    ordering: '-start_time',
  });

const loadData = (
  {
    match: {
      params: { companyId },
    },
  },
  dispatch
) =>
  Promise.all([
    dispatch(fetchSemesters()).then(() => dispatch(fetchAdmin(companyId))),
    dispatch(
      fetchEventsForCompany({
        queryString: queryString(companyId),
        loadNextPage: false,
      })
    ),
  ]);

const mapStateToProps = (state, props) => {
  const companyId = Number(props.match.params.companyId);
  const company = selectCompanyById(state, {
    companyId,
  });
  const comments = selectCommentsForCompany(state, {
    companyId,
  });
  const companyEvents = selectEventsForCompany(state, {
    companyId,
  });
  const companySemesters = selectCompanySemesters(state, props);
  const fetching = state.companies.fetching;
  const showFetchMoreEvents = selectPagination('events', {
    queryString: queryString(companyId),
  })(state);
  return {
    company,
    companyId,
    companyEvents,
    comments,
    companySemesters,
    fetching,
    showFetchMoreEvents,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { companyId } = props.match.params;

  const fetchMoreEvents = () =>
    dispatch(
      fetchEventsForCompany({
        queryString: queryString(companyId),
        loadNextPage: true,
      })
    );

  return {
    ...bindActionCreators(
      {
        deleteSemesterStatus,
        deleteCompanyContact,
        editSemesterStatus,
        editCompany,
        deleteCompany,
      },
      dispatch
    ),
    fetchMoreEvents,
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('withBdbDetail', loadData, (props) => [
    props.match.params.companyId,
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(BdbDetail);
