import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { fetch, editCompanyContact } from '../../actions/CompanyActions';
import EditCompanyContact from './components/EditCompanyContact';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData({ companyId }, props) {
  props.fetch(Number(companyId));
}

function validateCompanyContact(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }

  return errors;
}

function mapStateToProps(state, props) {
  const companyId = props.params.companyId;
  const company = state.companies.byId[companyId];
  const companyContactId = props.params.companyContactId;
  let companyContact = null;
  if (company) {
    companyContact = company.companyContacts.find((contact) =>
      contact.id === Number(companyContactId));
  }

  return {
    company,
    companyContact,
    initialValues: companyContact ? {
      name: companyContact.name,
      role: companyContact.role,
      mail: companyContact.mail,
      phone: companyContact.phone,
    } : null
  };
}

const mapDispatchToProps = { fetch, editCompanyContact };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: 'editCompanyContact',
    validate: validateCompanyContact
  }),
  fetchOnUpdate(['companyId', 'loggedIn'], loadData),
)(EditCompanyContact);
