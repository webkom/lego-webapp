import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { addCompany } from '../../actions/CompanyActions';
import AddCompany from './components/AddCompany';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

function validateCompany(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }

  return errors;
}

const mapDispatchToProps = { addCompany };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(null, mapDispatchToProps),
  reduxForm({
    form: 'addCompany',
    validate: validateCompany
  })
)(AddCompany);
