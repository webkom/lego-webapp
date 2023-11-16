import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetch as fetchCompany,
  fetchEventsForCompany,
  fetchJoblistingsForCompany,
} from 'app/actions/CompanyActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectCompanyById,
  selectEventsForCompany,
  selectJoblistingsForCompany,
} from 'app/reducers/companies';
import { selectPagination } from 'app/reducers/selectors';
import createQueryString from 'app/utils/createQueryString';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import CompanyDetail from './components/CompanyDetail';
import type { RootState } from 'app/store/createRootReducer';

const queryString = (companyId) =>
  createQueryString({
    company: companyId,
    ordering: '-start_time',
  });

const fetchData = (props, dispatch) => {
  const { companyId } = props.match.params;
  return Promise.all([
    dispatch(fetchCompany(companyId)),
    dispatch(
      fetchEventsForCompany({
        queryString: queryString(companyId),
        loadNextPage: false,
      })
    ),
    dispatch(fetchJoblistingsForCompany(companyId)),
  ]);
};

const mapStateToProps = (state: RootState, props) => {
  const { companyId } = props.match.params;
  const { query } = props.location;
  const showFetchMoreEvents = selectPagination('events', {
    queryString: queryString(companyId),
  })(state);
  const company = selectCompanyById(state, {
    companyId,
  });
  const fetching = state.companies.fetching;
  const companyEvents = selectEventsForCompany(state, {
    companyId,
  });
  const joblistings = selectJoblistingsForCompany(state, {
    companyId,
  });
  return {
    company,
    companyEvents,
    joblistings,
    query,
    companyId,
    loggedIn: props.currentUser,
    showFetchMoreEvents,
    fetching,
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
    fetchMoreEvents,
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchCompanyDetail', fetchData),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyDetail);
