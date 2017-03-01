import { connect } from 'react-redux';
import {
  fetch, deleteSemesterStatus, deleteCompanyContact
} from '../../actions/CompanyActions';
import BdbDetail from './components/BdbDetail';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import {
  selectCompanyById,
  selectEventsForCompany,
  selectCommentsForCompany
} from 'app/reducers/companies';

function mapStateToProps(state, props) {
  const companyId = props.params.companyId;
  const company = selectCompanyById(state, { companyId });
  const comments = selectCommentsForCompany(state, { companyId });
  const companyEvents = selectEventsForCompany(state, { companyId });
  return {
    company,
    companyId,
    companyEvents,
    comments
  };
}
const mapDispatchToProps = { fetch, deleteSemesterStatus, deleteCompanyContact };

function loadData(params, props) {
  props.fetch(props.companyId);
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['companyId', 'loggedIn'], loadData)
)(BdbDetail);
