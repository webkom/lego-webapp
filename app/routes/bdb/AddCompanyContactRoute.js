import { connect } from 'react-redux';
import { compose } from 'redux';

import { LoginPage } from 'app/components/LoginForm';
import { selectCompanyById } from 'app/reducers/companies';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { addCompanyContact, fetchAdmin } from '../../actions/CompanyActions';
import CompanyContactEditor from './components/CompanyContactEditor';

const mapStateToProps = (state, props) => {
  const companyId = Number(props.match.params.companyId);
  const company = selectCompanyById(state, { companyId });

  return {
    company,
    companyId,
  };
};

const mapDispatchToProps = { submitFunction: addCompanyContact };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(
    (
      {
        match: {
          params: { companyId },
        },
      },
      dispatch
    ) => dispatch(fetchAdmin(companyId)),
    ['match.params.companyId']
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyContactEditor);
