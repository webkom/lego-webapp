import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchAll, addSemesterStatus, editSemesterStatus
} from '../../actions/CompanyActions';
import BdbPage from './components/BdbPage';

type Props = {
  fetchAll: () => {}
};

class BdbRoute extends Component {
  props: Props;

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

function mapStateToProps(state, props) {
  const { query } = props.location;
  const companies = state.companies.items
    .map((id) => state.companies.byId[id])
    .filter((company) => !company.jobOfferOnly)
    .map((company) => ({
      ...company,
      studentContact: state.users.byId[company.studentContact]
    }));
  return {
    companies,
    query
  };
}

const mapDispatchToProps = { fetchAll, editSemesterStatus, addSemesterStatus };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BdbRoute);
