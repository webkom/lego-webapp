import { connect } from 'react-redux';
import { compose } from 'redux';
import { addCompany } from 'app/actions/CompanyActions';
import { uploadFile } from 'app/actions/FileActions';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import CompanyEditor from './components/CompanyEditor';

const mapStateToProps = () => {
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
      address: '',
    },
  };
};

const mapDispatchToProps = {
  submitFunction: addCompany,
  uploadFile,
};
export default compose(
  guardLogin,
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyEditor);
