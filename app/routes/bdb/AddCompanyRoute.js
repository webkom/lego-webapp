import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { addCompany } from '../../actions/CompanyActions';
import AddCompany from './components/AddCompany';

function validateCompany(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }

  return errors;
}

const mapDispatchToProps = { addCompany };

export default compose(
  connect(null, mapDispatchToProps),
  reduxForm({
    form: 'addCompany',
    validate: validateCompany
  })
)(AddCompany);
