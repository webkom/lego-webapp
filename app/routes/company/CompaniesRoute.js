import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/CompanyActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import CompaniesPage from './components/CompaniesPage';

function loadData(watched, props) {
  props.fetchAll();
}

type Props = {
  fetchAll: () => {}
};

const CompaniesRoute = (props: Props) => {
  return <CompaniesPage {...props} />;
};

function mapStateToProps(state, props) {
  const { query } = props.location;
  const companies = state.companies.items.map(
    item => state.companies.byId[item]
  );
  return {
    companies,
    query,
    loggedIn: state.auth.token !== null
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(CompaniesRoute);
