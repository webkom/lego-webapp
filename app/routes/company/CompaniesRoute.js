// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchAll } from 'app/actions/CompanyActions';
import CompaniesPage from './components/CompaniesPage';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectPagination } from '../../reducers/selectors';
import { selectCompanies } from 'app/reducers/companies';

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const companies = selectCompanies(state, props);
  const showFetchMore = selectPagination('companies', { queryString: '' })(
    state
  );
  return {
    showFetchMore,
    companies,
    query,
    loggedIn: props.loggedIn,
    hasMore: state.companies.hasMore,
    fetching: state.companies.fetching
  };
};

const mapDispatchToProps = {
  fetchMore: () => fetchAll({ fetchMore: true })
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare((props, dispatch) => dispatch(fetchAll({ fetchMore: false }))),
  // $FlowFixMe connect
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompaniesPage);
