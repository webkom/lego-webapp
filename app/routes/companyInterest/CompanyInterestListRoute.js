import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAll,
  createCompanyInterest,
  removeCompanyInterest
} from 'app/actions/CompanyInterestActions';
import CompanyInterestList from './components/CompanyInterestList';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';

const loadData = (params, props) => {
  props.fetchAll();
};

const mapStateToProps = state => {
  const companyInterestList = selectCompanyInterestList(state);
  return {
    companyInterestList
  };
};

const mapDispatchToProps = {
  fetchAll,
  createCompanyInterest,
  removeCompanyInterest
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(CompanyInterestList);
