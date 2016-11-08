import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { fetch, editSemesterStatus } from '../../actions/CompanyActions';
import EditSemester from './components/EditSemester';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  props.fetch(props.companyId);
}

function validateSemesterStatus(data) {
  const errors = {};
  if (!data.year) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }

  if (!data.semester) {
    errors.studentContact = 'Vennligst fyll ut dette feltet';
  }

  if (!data.contactedStatus) {
    errors.studentContact = 'Vennligst fyll ut dette feltet';
  }

  return errors;
}

function mapStateToProps(state, props) {
  const companyId = props.params.companyId;
  const company = state.companies.byId[companyId];
  const semesterId = props.params.semesterId;
  let semesterStatus = null;
  if (company) {
    semesterStatus = company.semesterStatuses[semesterId];
  }

  return {
    company,
    companyId,
    semesterStatus,
    initialValues: semesterStatus ? {
      year: semesterStatus.year,
      semester: semesterStatus.semester,
      contactedStatus: semesterStatus.contactedStatus
    } : null
  };
}

const mapDispatchToProps = { fetch, editSemesterStatus };

export default compose(
  reduxForm({
    form: 'editSemester',
    validate: validateSemesterStatus
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  fetchOnUpdate(['companyId, loggedIn'], loadData)
)(EditSemester);
