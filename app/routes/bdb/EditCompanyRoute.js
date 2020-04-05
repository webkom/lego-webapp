import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import {
  editCompany,
  fetchAdmin,
  deleteCompany
} from '../../actions/CompanyActions';
import CompanyEditor from './components/CompanyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { uploadFile } from 'app/actions/FileActions';
import { selectCompanyById } from 'app/reducers/companies';

const mapStateToProps = (state, props) => {
  const companyId = Number(props.match.params.companyId);
  const company = selectCompanyById(state, { companyId });
  const fetching = state.companies.fetching;

  return {
    company,
    companyId,
    fetching,
    initialValues: company
      ? {
          name: company.name,
          description: company.description,
          adminComment: company.adminComment,
          website: company.website,
          studentContact: company.studentContact && {
            value: Number(company.studentContact.id),
            label: company.studentContact.fullName
          },
          active: company.active ? 'true' : 'false',
          phone: company.phone,
          companyType: company.companyType,
          paymentMail: company.paymentMail,
          address: company.address
        }
      : null
  };
};

const mapDispatchToProps = {
  submitFunction: editCompany,
  uploadFile,
  deleteCompany
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(
    (
      {
        match: {
          params: { companyId }
        }
      },
      dispatch
    ) => dispatch(fetchAdmin(companyId)),
    ['match.params.companyId']
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompanyEditor);
