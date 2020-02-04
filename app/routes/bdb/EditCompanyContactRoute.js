import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import {
  fetchAdmin,
  editCompanyContact,
  deleteCompany
} from '../../actions/CompanyActions';
import CompanyContactEditor from './components/CompanyContactEditor';
import {
  selectCompanyById,
  selectCompanyContactById
} from 'app/reducers/companies';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const companyId = Number(props.match.params.companyId);
  const companyContactId = Number(props.match.params.companyContactId);
  const company = selectCompanyById(state, { companyId });
  const companyContact = selectCompanyContactById(state, {
    companyId,
    companyContactId
  });

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

const mapDispatchToProps = {
  submitFunction: editCompanyContact,
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
    ['match.params.companyId', 'match.params.companyContactId']
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompanyContactEditor);
