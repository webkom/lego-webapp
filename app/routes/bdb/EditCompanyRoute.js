import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { editCompany, fetch } from '../../actions/CompanyActions';
import EditCompany from './components/EditCompany';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { formValueSelector } from 'redux-form';

function loadData({ companyId }, props) {
  props.fetch(Number(companyId));
}

function validateCompany(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }
  return errors;
}

function mapStateToProps(state, props) {
  const companyId = props.params.companyId;
  const company = state.companies.byId[companyId];

  const valueSelector = formValueSelector('editCompany');

  return {
    company: {
      ...company,
      active: valueSelector(state, 'active')
    },
    companyId,
    initialValues: company
      ? {
          name: company.name,
          description: company.description,
          adminComment: company.adminComment,
          website: company.website,
          studentContact: company.studentContact,
          active: company.active ? 'true' : 'false',
          phone: company.phone,
          companyType: company.companyType,
          paymentMail: company.paymentMail,
          address: company.address
        }
      : null
  };
}

const mapDispatchToProps = { editCompany, fetch };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'editCompany',
    validate: validateCompany
  }),
  fetchOnUpdate(['companyId', 'loggedIn'], loadData)
)(EditCompany);
