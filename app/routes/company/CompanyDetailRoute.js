import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetch as fetchCompany } from 'app/actions/CompanyActions';
import CompanyDetail from './components/CompanyDetail';

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
    loggedIn: state.auth.token !== null
  };
};

const mapDispatchToProps = { fetchCompany };

export default compose(
  dispatched(
    ({ params: { companyId } }, dispatch) => dispatch(fetchCompany(companyId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyDetailRoute);
