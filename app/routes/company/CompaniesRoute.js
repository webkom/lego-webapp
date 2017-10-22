// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/CompanyActions';
import CompaniesPage from './components/CompaniesPage';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const companies = state.companies.items.map(
    item => state.companies.byId[item]
  );
  return {
    companies,
    query,
    loggedIn: props.loggedIn
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  // $FlowFixMe connect
  connect(mapStateToProps, null)
)(CompaniesPage);
