import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { compose } from 'redux';
import { fetch, editCompanyContact } from '../../actions/CompanyActions';
import CompanyContactEditor from './components/CompanyContactEditor';
import {
  selectCompanyById,
  selectCompanyContactById
} from 'app/reducers/companies';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const companyId = Number(props.params.companyId);
  const companyContactId = Number(props.params.companyContactId);
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

const mapDispatchToProps = { submitFunction: editCompanyContact };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    ({ params: { companyId } }, dispatch) => dispatch(fetch(companyId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyContactEditor);
