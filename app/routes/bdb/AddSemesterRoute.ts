import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { uploadFile } from 'app/actions/FileActions';
import { selectCompanies } from 'app/reducers/companies';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import {
  addSemesterStatus,
  fetchSemesters,
  addSemester,
  fetchAllAdmin,
  deleteCompany,
} from '../../actions/CompanyActions';
import AddSemester from './components/AddSemester';
import { semesterCodeToName } from './utils';

const validateSemesterStatus = (data, props) => {
  const errors = {};
  const { companies, companyId } = props;
  const { year, semester, contactedStatus } = data;
  const company = companies.find((company) => company.id === Number(companyId));

  if (!year) {
    errors.year = 'Vennligst fyll ut dette feltet';
  }

  if (!contactedStatus) {
    errors.studentContact = 'Vennligst fyll ut dette feltet';
  }

  const foundSemesterStatus =
    company &&
    company.semesterStatuses.find((semesterStatus) => {
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
  companyId: props.match.params.companyId,
  initialValues: props.match.params.companyId && {
    year: moment().year(),
    semester: 0,
    contactedStatus: 'not_contacted',
  },
  companySemesters: selectCompanySemesters(state, props),
  companies: selectCompanies(state, props),
});

const mapDispatchToProps = {
  addSemesterStatus,
  uploadFile,
  addSemester,
  deleteCompany,
};
export default compose(
  guardLogin,
  withPreparedDispatch(
    'fetchAddSemester',
    (props, dispatch) =>
      Promise.all([dispatch(fetchSemesters()), dispatch(fetchAllAdmin())]),
    (props) => [props.match.params.companyId]
  ),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addSemester',
    validate: validateSemesterStatus,
    enableReinitialize: true,
  })
)(AddSemester);
