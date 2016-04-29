import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchAll
} from '../../actions/BdbActions';
import BdbPage from './components/BdbPage';

const contactStatusToInt = (status) => {
  const contactStatusValues = {
    'bedpres': 7,
    'bedpres & kurs': 6,
    'kurs': 5,
    'interessert, ikke tilbudt': 4,
    'ikke interessert': 3,
    'kontaktet': 2,
    'ikke kontaktet': 1
  };
  return contactStatusValues[status] || -1;
};

const sortByContactStatus = (semester) => (ascending) => (a, b) => {
  const statusA = a.contacted[semester].toLowerCase();
  const statusB = b.contacted[semester].toLowerCase();
  if (contactStatusToInt(statusA) === contactStatusToInt(statusB)) {
    return a.name.localeCompare(b.name);
  } if (ascending) {
    return contactStatusToInt(statusA) - contactStatusToInt(statusB);
  } return contactStatusToInt(statusB) - contactStatusToInt(statusA);
};

const sortByAttribute = (attribute) => (ascending) => (a, b) => {
  if (a[attribute] === b[attribute]) {
    return a.name.localeCompare(b.name);
  }
  if (attribute === 'studentContact') {
     // Hard coding so that 'Ingen' student contact is sorted last
    if (a[attribute].toLowerCase() === 'ingen') {
      return 1;
    } else if (b[attribute].toLowerCase() === 'ingen') {
      return -1;
    }
  } else if (attribute === 'comment') {
    // Hard coding so that empty comment is sorted last
    if (a[attribute] === '') {
      return 1;
    } else if (b[attribute] === '') {
      return -1;
    }
  }
  return ascending ?
  b[attribute].localeCompare(a[attribute]) : a[attribute].localeCompare(b[attribute]);
};

const sortCompanies = (companies, query) => {
  const queryToSortType = {
    nameSort: sortByAttribute('name'),
    sem0Sort: sortByContactStatus(0),
    sem1Sort: sortByContactStatus(1),
    sem2Sort: sortByContactStatus(2),
    sem3Sort: sortByContactStatus(3),
    contactSort: sortByAttribute('studentContact'),
    commentSort: sortByAttribute('comment')
  };

  for (const sortType in queryToSortType) {
    if (query[sortType]) {
      const ascending = query[sortType] === 'ascending';
      const sortFunction = queryToSortType[sortType](ascending);
      return companies.sort(sortFunction);
    }
  } // Sort by company name, ascending alphabetically, by default
  return companies.sort((a, b) => a.name - b.name);
};

function mapStateToProps(state, props) {
  const { query } = props.location;
  const companies = state.bdb.items
    .map((id) => state.entities.companies[id])
    .filter((company) => !company.jobOfferOnly);

  return {
    companies: sortCompanies(companies, query),
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
