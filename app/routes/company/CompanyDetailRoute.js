// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import {
  fetch as fetchCompany,
  fetchEventsForCompany,
  fetchJoblistingsForCompany
} from 'app/actions/CompanyActions';
import CompanyDetail from './components/CompanyDetail';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import {
  selectEventsForCompany,
  selectJoblistingsForCompany
} from 'app/reducers/companies';

const fetchData = (props, dispatch) =>
  Promise.all([
    dispatch(fetchCompany(props.params.companyId)),
    dispatch(fetchEventsForCompany(props.params.companyId)),
    dispatch(fetchJoblistingsForCompany(props.params.companyId))
  ]);

const mapStateToProps = (state, props) => {
  const { companyId } = props.params;
  const { query } = props.location;
  const company = state.companies.byId[companyId];
  const companyEvents = selectEventsForCompany(state, { companyId });
  const joblistings = selectJoblistingsForCompany(state, { companyId });

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
  dispatched(fetchData, {
    componentWillReceiveProps: false
  }),
  // $FlowFixMe
  connect(mapStateToProps, null)
)(CompanyDetail);
