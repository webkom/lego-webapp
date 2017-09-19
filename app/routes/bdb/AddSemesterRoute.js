import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { addSemesterStatus } from '../../actions/CompanyActions';
import AddSemester from './components/AddSemester';
import moment from 'moment';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { uploadFile } from 'app/actions/FileActions';

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

const mapDispatchToProps = { addSemesterStatus, uploadFile };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addSemester',
    validate: validateSemesterStatus,
    enableReinitialize: true
  })
)(AddSemester);
