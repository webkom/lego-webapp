import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/BdbActions';
import CompanyPage from './components/CompanyPage';
import React, { Component } from 'react';

type Props = {
  fetchAll: () => {}
};

class CompanyRoute extends Component {
  props: Props;

  componentWillMount() {
    this.props.fetchAll();
  }

  render() {
    return (
      <CompanyPage
        {...this.props}
      />
    );
  }
}


function mapStateToProps(state, props) {
  const { query } = props.location;
  const companies = state.companies.items
    .map((id) => state.companies.byId[id]);
  return {
    company: companies[0],  // 0 foreløbig
    query
  };
}

const mapDispatchToProps = { fetchAll };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyRoute);
