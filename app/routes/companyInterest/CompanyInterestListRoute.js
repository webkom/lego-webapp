// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAll,
  deleteCompanyInterest
} from 'app/actions/CompanyInterestActions';
import CompanyInterestList from './components/CompanyInterestList';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import { dispatched } from '@webkom/react-prepare';

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
  connect(mapStateToProps, mapDispatchToProps),
  dispatched(loadCompanyInterests, {
    componentWillReceiveProps: false
  })
)(CompanyInterestList);
