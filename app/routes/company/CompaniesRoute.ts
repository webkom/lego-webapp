import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAll } from 'app/actions/CompanyActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectActiveCompanies } from 'app/reducers/companies';
import { selectPaginationNext } from 'app/reducers/selectors';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import CompaniesPage from './components/CompaniesPage';

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const companies = selectActiveCompanies(state);
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
  fetchMore: () =>
    fetchAll({
      fetchMore: true,
    }),
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchCompanies', (props, dispatch) =>
    dispatch(fetchAll({ fetchMore: false })),
  ),
  connect(mapStateToProps, mapDispatchToProps),
)(CompaniesPage);
