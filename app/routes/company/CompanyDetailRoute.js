// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  fetch as fetchCompany,
  fetchEventsForCompany,
  fetchJoblistingsForCompany,
} from 'app/actions/CompanyActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectEventsForCompany,
  selectJoblistingsForCompany,
} from 'app/reducers/companies';
import createQueryString from 'app/utils/createQueryString';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectPagination } from '../../reducers/selectors';
import CompanyDetail from './components/CompanyDetail';

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

const mapStateToProps = (state, props) => {
  const { companyId } = props.match.params;
  const { query } = props.location;
  const showFetchMoreEvents = selectPagination('events', {
    queryString: queryString(companyId),
  })(state);
  const company = state.companies.byId[companyId];
  const companyEvents = selectEventsForCompany(state, { companyId });
  const joblistings = selectJoblistingsForCompany(state, { companyId });
  return {
    company,
    companyEvents,
    joblistings,
    query,
    companyId,
    loggedIn: props.currentUser,
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
    fetchMoreEvents,
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(fetchData),
  // $FlowFixMe
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyDetail);
