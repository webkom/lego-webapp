import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetch as fetchCompany } from 'app/actions/CompanyActions';
import CompanyDetail from './components/CompanyDetail';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

type Props = {
  fetchCompany: () => {}
};

const CompanyDetailRoute = (props: Props) => {
  return <CompanyDetail {...props} />;
};

const mapStateToProps = (state, props) => {
  const companyId = props.params.companyId;
  const { query } = props.location;
  const company = state.companies.byId[companyId];
  return {
    company,
    query,
    companyId,
    loggedIn: props.currentUser
  };
};

const mapDispatchToProps = { fetchCompany };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    ({ params: { companyId } }, dispatch) => dispatch(fetchCompany(companyId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyDetailRoute);
