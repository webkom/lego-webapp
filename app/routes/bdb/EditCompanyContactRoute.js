import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { fetch, editCompanyContact } from '../../actions/CompanyActions';
import EditCompanyContact from './components/EditCompanyContact';
import { selectCompanyById } from 'app/reducers/companies';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

function validateCompanyContact(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }
  return errors;
}

const mapStateToProps = (state, props) => {
  const { companyId, companyContactId } = props.params;
  const company = selectCompanyById(state, { companyId });

  // TODO: Create selector for companyContact
  let companyContact = null;
  if (company) {
    companyContact = company.companyContacts.find(
      contact => contact.id === Number(companyContactId)
    );
  }

  return {
    company,
    companyId,
    companyContact,
    initialValues: companyContact
      ? {
          name: companyContact.name,
          role: companyContact.role,
          mail: companyContact.mail,
          phone: companyContact.phone
        }
      : null
  };
};

const mapDispatchToProps = { fetch, editCompanyContact };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(({ params: { companyId } }, dispatch) => dispatch(fetch(companyId)), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'editCompanyContact',
    validate: validateCompanyContact
  })
)(EditCompanyContact);
