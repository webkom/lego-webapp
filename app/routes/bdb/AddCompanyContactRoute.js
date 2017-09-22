import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { fetch, addCompanyContact } from '../../actions/CompanyActions';
import AddCompanyContact from './components/AddCompanyContact';
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
  const companyId = props.params.companyId;
  const company = selectCompanyById(state, { companyId });

  return {
    company,
    companyId
  };
};

const mapDispatchToProps = { fetch, addCompanyContact };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(({ params: { companyId } }, dispatch) => dispatch(fetch(companyId)), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addCompanyContact',
    validate: validateCompanyContact
  })
)(AddCompanyContact);
