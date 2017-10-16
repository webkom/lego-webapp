import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import {
  addSemesterStatus,
  fetchSemesters,
  addSemester,
  fetchAll
} from '../../actions/CompanyActions';
import { selectCompanies } from 'app/reducers/companies';
import AddSemester from './components/AddSemester';
import moment from 'moment';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { uploadFile } from 'app/actions/FileActions';
import { dispatched } from '@webkom/react-prepare';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { semesterCodeToName } from './utils.js';

const validateSemesterStatus = (data, props) => {
  const errors = {};

  const { companies, companyId } = props;
  const { year, semester, contactedStatus } = data;

  const company = companies.find(company => company.id == Number(companyId));

  if (!year) {
    errors.year = 'Vennligst fyll ut dette feltet';
  }

  if (!contactedStatus) {
    errors.studentContact = 'Vennligst fyll ut dette feltet';
  }

  const foundSemesterStatus =
    company &&
    company.semesterStatuses.find(semesterStatus => {
      return (
        semesterStatus.year === year && semesterStatus.semester === semester
      );
    });
  if (foundSemesterStatus) {
    const semesterFoundError = `Denne bedriften har allerede en registrert semester status for
      ${semesterCodeToName(
        semester
      )} ${year}. Du kan endre den på bedriftens side.`;
    errors.year = semesterFoundError;
  }

  return errors;
};

const mapStateToProps = (state, props) => ({
  companyId: props.params.companyId,
  initialValues: props.params.companyId && {
    year: moment().year(),
    semester: 0,
    contactedStatus: 'not_contacted'
  },
  companySemesters: selectCompanySemesters(state, props),
  companies: selectCompanies(state, props)
});

const mapDispatchToProps = { addSemesterStatus, uploadFile, addSemester };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    (props, dispatch) =>
      Promise.all([dispatch(fetchSemesters()), dispatch(fetchAll())]),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addSemester',
    validate: validateSemesterStatus,
    enableReinitialize: true
  })
)(AddSemester);
