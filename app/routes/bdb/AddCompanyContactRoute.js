import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { compose } from 'redux';
import { fetch, addCompanyContact } from '../../actions/CompanyActions';
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
  dispatched(
    ({ params: { companyId } }, dispatch) => dispatch(fetch(companyId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyContactEditor);
