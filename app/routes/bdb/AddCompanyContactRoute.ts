import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAdmin, addCompanyContact } from '../../actions/CompanyActions';
import CompanyContactEditor from './components/CompanyContactEditor';
import { selectCompanyById } from 'app/store/slices/companiesSlice';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const companyId = Number(props.match.params.companyId);
  const company = selectCompanyById(state, {
    companyId,
  });
  return {
    company,
    companyId,
  };
};

const mapDispatchToProps = {
  submitFunction: addCompanyContact,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch(
    'fetchAddCompanyContact',
    (
      {
        match: {
          params: { companyId },
        },
      },
      dispatch
    ) => dispatch(fetchAdmin(companyId)),
    (props) => [props.match.params.companyId]
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyContactEditor);
