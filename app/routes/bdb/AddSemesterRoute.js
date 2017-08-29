import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { addSemesterStatus } from '../../actions/CompanyActions';
import AddSemester from './components/AddSemester';
import moment from 'moment';

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

const mapStateToProps = (state, props) => ({
  companyId: props.params.companyId,
  initialValues: props.params.companyId && {
    bedex: false,
    year: moment().year(),
    semester: 0,
    contactedStatus: 6
  }
});

const mapDispatchToProps = { addSemesterStatus };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addSemester',
    validate: validateSemesterStatus,
    enableReinitialize: true
  })
)(AddSemester);
