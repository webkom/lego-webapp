import { connect } from 'react-redux';
import {
  fetch, deleteSemesterStatus
} from '../../actions/CompanyActions';
import CompanyDetail from './components/CompanyDetail';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function mapStateToProps(state, props) {
  const companyId = props.params.companyId;
  const company = state.companies.byId[companyId];
  let comments = [];
  if (company) {
    if (company.comments) {
      comments = company.comments.map((comment) => state.comments.byId[comment]);
    }
  }

  return {
    company,
    companyId,
    comments
  };
}
const mapDispatchToProps = { fetch, deleteSemesterStatus };

function loadData(params, props) {
  props.fetch(props.companyId);
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['companyId', 'loggedIn'], loadData)
)(CompanyDetail);
