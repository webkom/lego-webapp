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
import { selectPaginationNext } from 'app/reducers/selectors';
import { EntityType } from 'app/store/models/entities';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import CompanyDetail from './components/CompanyDetail';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';

const getQuery = (companyId: ID) => ({
  company: String(companyId),
  ordering: '-start_time',
});

const fetchData = (props, dispatch) => {
  const { companyId } = props.match.params;
  return Promise.all([
    dispatch(fetchCompany(companyId)),
    dispatch(
      fetchEventsForCompany({
        query: getQuery(companyId),
        next: false,
      })
    ),
    dispatch(fetchJoblistingsForCompany(companyId)),
  ]);
};

const mapStateToProps = (state: RootState, props) => {
  const { companyId } = props.match.params;
  const { query } = props.location;
  const { pagination } = selectPaginationNext({
    entity: EntityType.Events,
    endpoint: `/events/`,
    query: getQuery(companyId),
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
    showFetchMoreEvents: pagination?.hasMore,
    fetching,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { companyId } = props.match.params;

  const fetchMoreEvents = () =>
    dispatch(
      fetchEventsForCompany({
        query: getQuery(companyId),
        next: true,
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
