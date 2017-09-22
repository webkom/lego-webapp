import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchAll } from 'app/actions/CompanyActions';
import CompaniesPage from './components/CompaniesPage';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

type Props = {
  fetchAll: () => {}
};

const CompaniesRoute = (props: Props) => {
  return <CompaniesPage {...props} />;
};

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const companies = state.companies.items.map(item => state.companies.byId[item]);
  return {
    companies,
    query,
    loggedIn: props.loggedIn
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(CompaniesRoute);
