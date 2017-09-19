import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { addCompany } from '../../actions/CompanyActions';
import CompanyEditor from './components/CompanyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { uploadFile } from 'app/actions/FileActions';

function validateCompany(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }

  return errors;
}

const mapStateToProps = (state, props) => {
  return {
    initialValues: {
      name: '',
      description: '',
      adminComment: '',
      website: '',
      studentContact: '',
      active: 'true',
      phone: '',
      companyType: '',
      paymentMail: '',
      address: ''
    },
    isEditPage: false
  };
};

const mapDispatchToProps = { addCompany, uploadFile };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addCompany',
    validate: validateCompany
  })
)(CompanyEditor);
