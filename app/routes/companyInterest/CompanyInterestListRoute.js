// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAll,
  deleteCompanyInterest,
  fetch
} from 'app/actions/CompanyInterestActions';
import { fetchSemestersForInterestform } from 'app/actions/CompanyActions';
import CompanyInterestList from './components/CompanyInterestList';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import prepare from 'app/utils/prepare';

const loadCompanyInterests = (props, dispatch) => dispatch(fetchAll());

const mapStateToProps = (state, props) => {
  let { params } = props;
  const companyInterestList = selectCompanyInterestList(state, {
    selectedSemester: params.companySemesterId
  });
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
  fetch,
  fetchSemestersForInterestform
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadCompanyInterests),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestList);
