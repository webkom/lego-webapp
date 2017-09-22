import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { editCompany, fetch } from '../../actions/CompanyActions';
import EditCompany from './components/EditCompany';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

function validateCompany(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }
  return errors;
}

const mapStateToProps = (state, props) => {
  const companyId = props.params.companyId;
  const company = state.companies.byId[companyId];

  return {
    company,
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
};

const mapDispatchToProps = { editCompany, fetch };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(({ params: { companyId } }, dispatch) => dispatch(fetch(companyId)), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'editCompany',
    validate: validateCompany
  })
)(EditCompany);
