import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchCompany } from 'app/actions/BdbActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import CompanyDetail from './components/CompanyDetail';
import React, { Component } from 'react';

function loadData({ companyId }, props) {
  props.fetchCompany(Number(companyId));
}

type Props = {
  fetchCompany: () => {}
};

class CompanyDetailRoute extends Component {
  props: Props;

  render() {
    return (
      <CompanyDetail
        {...this.props}
      />
    );
  }
}


function mapStateToProps(state, props) {
  const companyId = props.params.companyId;
  const { query } = props.location;
  const company = state.companies.byId[companyId];
  return {
    company,
    query,
    companyId,
    loggedIn: state.auth.token !== null
  };
}

const mapDispatchToProps = { fetchCompany };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  fetchOnUpdate(['companyId', 'loggedIn'], loadData)
)(CompanyDetailRoute);
