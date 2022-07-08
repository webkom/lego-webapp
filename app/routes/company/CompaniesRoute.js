// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchAll } from 'app/actions/CompanyActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectActiveCompanies } from 'app/reducers/companies';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectPaginationNext } from '../../reducers/selectors';
import CompaniesPage from './components/CompaniesPage';

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const companies = selectActiveCompanies(state, props);
  const { pagination } = selectPaginationNext({
    query: {},
    entity: 'companies',
    endpoint: '/companies/',
  })(state);
  return {
    showFetchMore: pagination.hasMore,
    companies,
    query,
    loggedIn: props.loggedIn,
    hasMore: pagination.hasMore,
    fetching: state.companies.fetching,
  };
};

const mapDispatchToProps = {
  fetchMore: () => fetchAll({ fetchMore: true }),
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare((props, dispatch) => dispatch(fetchAll({ fetchMore: false }))),
  // $FlowFixMe connect
  connect(mapStateToProps, mapDispatchToProps)
)(CompaniesPage);
