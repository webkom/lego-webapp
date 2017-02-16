import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { fetch, editCompanyContact } from '../../actions/CompanyActions';
import AddCompanyContact from './components/AddCompanyContact';

function validateCompanyContact(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }

  return errors;
}

function mapStateToProps(state, props) {
  return {
    companyId: props.params.companyId
  };
}

const mapDispatchToProps = { fetch, editCompanyContact };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: 'addCompanyContact',
    validate: validateCompanyContact
  })
)(AddCompanyContact);
