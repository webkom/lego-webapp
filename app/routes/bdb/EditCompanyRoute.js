import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { editCompany, fetch } from '../../actions/CompanyActions';
import EditCompany from './components/EditCompany';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

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

  return {
    company,
    initialValues: company ? {
      name: company.name,
      studentContact: company.studentContact,
      adminComment: company.adminComment,
      active: company.active,
      jobOfferOnly: company.jobOfferOnly,
      bedex: company.bedex,
      description: company.description,
      phone: company.phone,
      website: company.website
    } : null
  };
}

const mapDispatchToProps = { editCompany, fetch };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: 'editCompany',
    validate: validateCompany
  }),
  fetchOnUpdate(['companyId', 'loggedIn'], loadData),
)(EditCompany);
