import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import { fetchAdmin, addCompanyContact } from '../../actions/CompanyActions';
import CompanyContactEditor from './components/CompanyContactEditor';
import { selectCompanyById } from 'app/reducers/companies';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const companyId = Number(props.match.params.companyId);
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
)(CompanyContactEditor);
