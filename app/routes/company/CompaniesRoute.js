import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchAll } from 'app/actions/CompanyActions';
import CompaniesPage from './components/CompaniesPage';

type Props = {
  fetchAll: () => {}
};

const CompaniesRoute = (props: Props) => {
  return <CompaniesPage {...props} />;
};

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const companies = state.companies.items.map(
    item => state.companies.byId[item]
  );
  return {
    companies,
    query,
    loggedIn: state.auth.token !== null
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(CompaniesRoute);
