import { connect } from 'react-redux';
import {
  fetch, addCompany
} from '../../actions/BdbActions';
import CompanyDetail from './components/CompanyDetail';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function mapStateToProps(state, props) {
  const companyId = props.params.companyId;
  const company = state.companies.items
    .map((id) => state.entities.companies[id])[0];

  return {
    company,
    companyId
  };
}

const mapDispatchToProps = { fetch, addCompany };

function loadData(params, props) {
  props.fetch(props.companyId);
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['companyId'], loadData)
)(CompanyDetail);
