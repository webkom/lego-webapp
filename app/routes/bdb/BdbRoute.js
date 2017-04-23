import { connect } from 'react-redux';
import {
  fetchAll,
  addSemesterStatus,
  editSemesterStatus
} from '../../actions/CompanyActions';
import BdbPage from './components/BdbPage';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectCompanies } from 'app/reducers/companies';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state, props) {
  const companies = selectCompanies(state, props);
  const { query } = props.location;
  return {
    companies,
    query
  };
}

const mapDispatchToProps = { fetchAll, editSemesterStatus, addSemesterStatus };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(BdbPage);
