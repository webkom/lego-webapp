import React, { Component, PropTypes } from 'react';
import CompanyList from './CompanyList';
import styles from './bdb.css';
import sortCompanies from '../SortCompanies.js';

export default class BdbPage extends Component {

  static propTypes = {
    companies: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired
  };

  state = {
    startYear: 2016,
    startSem: 0
  }

  changeSemesters = (forward) => {
    const { startSem, startYear } = this.state;
    const newSem = (startSem + 1) % 2;

    let newYear = 0;
    if (forward) {
      newYear = startSem === 0 ? startYear : startYear + 1;
    } else {
      newYear = startSem === 1 ? startYear : startYear - 1;
    }
    this.setState({ startYear: newYear, startSem: newSem });
  };

  render() {
    const { companies, query } = this.props;
    const sortedCompanies = sortCompanies(companies, query, this.state.startYear,
      this.state.startSem);
    return (
      <div className={styles.root}>

        <h1>Bedriftsdatabase</h1>

          <CompanyList
            {...this.props}
            startYear={this.state.startYear}
            startSem={this.state.startSem}
            companies={sortedCompanies}
            changeSemesters={this.changeSemesters}
          />

      </div>
    );
  }
}
