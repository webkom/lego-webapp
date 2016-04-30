import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetch
} from '../../actions/BdbActions';
import CompanyDetail from './components/CompanyDetail';

function mapStateToProps(state, props) {
  const companyId = props.params.companyId;
  const company = state.companies.items
    .map((id) => state.entities.companies[id])[0];

  return {
    company,
    companyId
  };
}

const mapDispatchToProps = { fetch };

class CompanyDetailContainer extends Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetch(this.props.companyId);
  }

  render() {
    return (
      <CompanyDetail
        company = {this.props.company}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyDetailContainer);
