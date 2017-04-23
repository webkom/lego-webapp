import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { fetch, addCompanyContact } from '../../actions/CompanyActions';
import AddCompanyContact from './components/AddCompanyContact';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectCompanyById } from 'app/reducers/companies';

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
  const company = selectCompanyById(state, { companyId });

  return {
    company,
    companyId
  };
}

const mapDispatchToProps = { fetch, addCompanyContact };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addCompanyContact',
    validate: validateCompanyContact
  }),
  fetchOnUpdate(['companyId', 'loggedIn'], loadData)
)(AddCompanyContact);
