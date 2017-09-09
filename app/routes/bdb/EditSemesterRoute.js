import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { fetch, editSemesterStatus } from '../../actions/CompanyActions';
import EditSemester from './components/EditSemester';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

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

const mapStateToProps = (state, props) => {
  const companyId = props.params.companyId;
  const company = state.companies.byId[companyId];
  const semesterId = props.params.semesterId;
  let semesterStatus = null;
  if (company) {
    semesterStatus = company.semesterStatuses.find(
      status => status.id === Number(semesterId)
    );
  }

  return {
    company,
    companyId,
    semesterStatus,
    initialValues: semesterStatus && {
      contactedStatus: semesterStatus.contactedStatus,
      contract: semesterStatus.contract
    }
  };
};

const mapDispatchToProps = { fetch, editSemesterStatus };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    ({ params: { companyId } }, dispatch) => dispatch(fetch(companyId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'editSemester',
    validate: validateSemesterStatus
  })
)(EditSemester);
