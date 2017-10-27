import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import { fetchAdmin, addCompanyContact } from '../../actions/CompanyActions';
import CompanyContactEditor from './components/CompanyContactEditor';
import { selectCompanyById } from 'app/reducers/companies';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const companyId = Number(props.params.companyId);
  const company = selectCompanyById(state, { companyId });

  return {
    company,
    companyId
  };
};

const mapDispatchToProps = { submitFunction: addCompanyContact };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(
    ({ params: { companyId } }, dispatch) => dispatch(fetchAdmin(companyId)),
    ['params.companyId']
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyContactEditor);
