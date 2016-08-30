import React, { Component } from 'react';
import CompanyList from './CompanyList';
import styles from './bdb.css';
import sortCompanies from '../SortCompanies.js';
import { indexToSemester } from '../utils.js';
import Button from 'app/components/Button';

type Props = {
  companies: Array<Object>,
  query: Object,
  editSemesterStatus: () => void,
  addSemesterStatus: () => void
};

export default class BdbPage extends Component {

  props: Props;

  state = {
    companies: [],
    startYear: 2016,
    startSem: 0,
    changedStatuses: [],
    submitted: false
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      companies: newProps.companies
    });
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
    this.setState({ ...this.state, startYear: newYear, startSem: newSem });
  };

  handleChange = (event, index) => {
    const { changedStatuses, companies, startYear, startSem } = this.state;
    const data = event.target.value.split('-');
    const yearAndSemester = indexToSemester(parseInt(data[1], 10), startYear, startSem);

    const matchSemester = (status) => (
      status.year === yearAndSemester.year &&
      status.semester === yearAndSemester.semester &&
      status.companyId === parseInt(data[0], 10)
    );

    // Find which semester has been changed
    const changedCompanyIndex = companies.indexOf(companies.filter(
      (company) => company.id === parseInt(data[0], 10)
    )[0]);
    const changedCompanyStatuses = companies[changedCompanyIndex].semesterStatuses;
    const changedSemesterIndex = changedCompanyStatuses.indexOf(
      changedCompanyStatuses.filter((status) => (
        status.year === yearAndSemester.year && status.semester === yearAndSemester.semester)
      )[0]
    );

    // If the semester doesn't exist yet, make it. Otherwise, update it.
    // First in state.companies
    if (changedSemesterIndex === -1) {
      // We have to add a new semester to state.companies
      console.log('Må legge til i companies');
      companies[changedCompanyIndex].semesterStatuses.push(
        {
          id: data[2],
          contactedStatus: parseInt(data[3], 10),
          year: parseInt(indexToSemester(index, startYear, startSem).year, 10),
          semester: parseInt(indexToSemester(index, startYear, startSem).semester, 10)
        }
      );
    } else {
      // We're changing an existing semesterStatus in state.companies
      console.log('Endrer eksisterende company');
      companies[changedCompanyIndex].semesterStatuses[changedSemesterIndex].contactedStatus
      = parseInt(data[3], 10);
    }

    // Then in state.changedStatuses
    if (typeof changedStatuses.find(matchSemester) === 'undefined') {
      // We have to add a new semester to state.changedStatuses
      changedStatuses.push(
        {
          companyId: parseInt(data[0], 10),
          semesterId: data[2],
          value: parseInt(data[3], 10),
          year: parseInt(indexToSemester(index, startYear, startSem).year, 10),
          semester: parseInt(indexToSemester(index, startYear, startSem).semester, 10)
        }
      );
    } else {
      // We're changing an existing entry in state.changedStatuses
      changedStatuses.find(matchSemester).value = parseInt(data[3], 10);
    }

    this.setState({
      companies,
      changedStatuses
    });
  };

  removeChangedStatus = (semesterId) => {
    const changedStatuses = this.state.changedStatuses.splice();
    changedStatuses.splice(changedStatuses.indexOf(semesterId), 1);
    for (const status in changedStatuses) {
      if (parseInt(status.semesterId, 10) === semesterId) {
        changedStatuses.splice(changedStatuses.indexOf(status), 1);
      }
    }
    this.setState({ ...this.state, changedStatuses });
  }

  submitChange = () => {
    this.state.changedStatuses.forEach((status) => {
      console.log('Submitting status: ');
      console.log(status);
      if (status.semesterId === 'undefined') {
        this.props.addSemesterStatus(status);
      } else {
        this.props.editSemesterStatus(status);
      }
    });
    this.setState({ changedStatuses: [], submitted: true });
  };

  render() {
    const { query } = this.props;
    const sortedCompanies = sortCompanies(this.state.companies, query, this.state.startYear,
      this.state.startSem);

    return (
      <div className={styles.root}>

        <h1>Bedriftsdatabase</h1>

        {this.state.changedStatuses.length > 0 ? (
          <Button onClick={this.submitChange} dark>Lagre endringer</Button>
        ) : ''}
        {this.state.submitted ? 'Lagret!' : ''}

        <i style={{ display: 'block' }}>
          <b>Tips:</b> Du kan endre semestere ved å trykke på dem i listen! Semestere merket med *
          er endringer klare for lagring.
        </i>

        <CompanyList
          {...this.props}
          startYear={this.state.startYear}
          startSem={this.state.startSem}
          companies={sortedCompanies}
          changeSemesters={this.changeSemesters}
          handleChange={this.handleChange}
          removeChangedStatus={this.removeChangedStatus}
          changedStatuses = {this.state.changedStatuses}
        />

      </div>
    );
  }
}
