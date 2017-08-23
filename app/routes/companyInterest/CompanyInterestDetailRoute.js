import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import {
  fetchCompanyInterest,
  updateCompanyInterest,
  removeCompanyInterest
} from 'app/actions/CompanyInterestActions';
import CompanyInterestDetail from './components/CompanyInterestDetail';
import { selectCompanyInterestById } from 'app/reducers/companyInterest';

function loadData({ companyInterestId }, props) {
  props.fetchCompanyInterest(Number(companyInterestId));
}

function mapStateToProps(state, props) {
  const { companyInterestId } = props.params;
  const company = selectCompanyInterestById(state, { companyInterestId });

  return {
    company,
    companyInterestId
  };
}

const mapDispatchToProps = {
  fetchCompanyInterest,
  updateCompanyInterest,
  removeCompanyInterest
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['companyInterestId', 'loggedIn'], loadData)
)(CompanyInterestDetail);
