// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetch as fetchCompany } from 'app/actions/CompanyActions';
import CompanyDetail from './components/CompanyDetail';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectEventsForCompany } from 'app/reducers/companies';

const mapStateToProps = (state, props) => {
  const { companyId } = props.params;
  const { query } = props.location;
  const company = state.companies.byId[companyId];
  const companyEvents = selectEventsForCompany(state, { companyId });
  const joblistings = state.joblistings.items.map(
    id => state.joblistings.byId[id]
  );

  return {
    company,
    companyEvents,
    joblistings,
    query,
    companyId,
    loggedIn: props.currentUser
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    ({ params: { companyId } }, dispatch) => dispatch(fetchCompany(companyId)),
    {
      componentWillReceiveProps: false
    }
  ),
  // $FlowFixMe
  connect(mapStateToProps, null)
)(CompanyDetail);
