import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { addSemesterStatus } from '../../actions/CompanyActions';
import AddSemester from './components/AddSemester';

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
  return {
    companyId: props.params.companyId,
    initialValues: props.params.companyId ? {
      bedex: false
    } : null
  };
}

const mapDispatchToProps = { addSemesterStatus };

export default compose(
  reduxForm({
    form: 'addSemester',
    validate: validateSemesterStatus
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddSemester);
