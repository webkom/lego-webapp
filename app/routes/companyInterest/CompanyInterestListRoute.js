// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAll,
  deleteCompanyInterest
} from 'app/actions/CompanyInterestActions';
import CompanyInterestList from './components/CompanyInterestList';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import prepare from 'app/utils/prepare';

const loadCompanyInterests = (props, dispatch) => dispatch(fetchAll());

const mapStateToProps = state => {
  const companyInterestList = selectCompanyInterestList(state);
  return {
    companyInterestList
  };
};

const mapDispatchToProps = {
  fetchAll,
  deleteCompanyInterest
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadCompanyInterests),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestList);
