import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchAll
} from '../../actions/BdbActions';
import BdbPage from './components/BdbPage';

function mapStateToProps(state, props) {
  const { query } = props.location;
  const companies = state.companies.items
    .map((id) => state.entities.companies[id])
    .filter((company) => !company.jobOfferOnly);

  return {
    companies,
    query
  };
}

const mapDispatchToProps = { fetchAll };

class BdbContainer extends Component {
  static propTypes = {
    fetchAll: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchAll();
  }

  render() {
    return (
      <BdbPage
        {...this.props}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BdbContainer);
