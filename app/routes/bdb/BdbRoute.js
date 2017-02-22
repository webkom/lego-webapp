import { connect } from 'react-redux';
import {
  fetchAll, addSemesterStatus, editSemesterStatus
} from '../../actions/CompanyActions';
import BdbPage from './components/BdbPage';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state, props) {
  const { query } = props.location;
  const companies = state.companies.items
    .map((id) => state.companies.byId[id])
    .filter((company) => !company.jobOfferOnly)
    .map((company) => ({
      ...company,
      studentContact: state.users.byId[company.studentContact]
    }));
  return {
    companies,
    query
  };
}

const mapDispatchToProps = { fetchAll, editSemesterStatus, addSemesterStatus };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  fetchOnUpdate(['loggedIn'], loadData)
)(BdbPage);
