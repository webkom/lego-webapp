// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAll,
  deleteCompanyInterest,
  fetch
} from 'app/actions/CompanyInterestActions';
import CompanyInterestList from './components/CompanyInterestList';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import prepare from 'app/utils/prepare';

const loadCompanyInterests = (props, dispatch) => dispatch(fetchAll());

const mapStateToProps = state => {
  const companyInterestList = selectCompanyInterestList(state);
  const hasMore = state.companyInterest.hasMore;
  const fetching = state.companyInterest.fetching;

  return {
    companyInterestList,
    hasMore,
    fetching
  };
};

const mapDispatchToProps = {
  fetchAll,
  deleteCompanyInterest,
  fetch
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadCompanyInterests),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestList);
