import React, { Component } from 'react';
import CompanyList from './CompanyList';
import styles from './bdb.css';
import sortCompanies from '../SortCompanies.js';
import { indexToSemester, trueIcon } from '../utils.js';
import Button from 'app/components/Button';
import OptionsBox from './OptionsBox';
import TextInput from 'app/components/Form/TextInput';

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
    submitted: false,
    displayOptions: false,
    filters: {},
    searchQuery: ''
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
    const yearAndSemester = indexToSemester(Number(data[1]), startYear, startSem);

    const matchSemester = (status) => (
      status.year === yearAndSemester.year &&
      status.semester === yearAndSemester.semester &&
      status.companyId === Number(data[0])
    );

    // Find which semester has been changed
    const changedCompanyIndex = companies.indexOf(companies.filter(
      (company) => company.id === Number(data[0])
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
      companies[changedCompanyIndex].semesterStatuses.push(
        {
          id: data[2],
          contactedStatus: Number(data[3]),
          year: Number(indexToSemester(index, startYear, startSem).year),
          semester: Number(indexToSemester(index, startYear, startSem).semester)
        }
      );
    } else {
      // We're changing an existing semesterStatus in state.companies
      companies[changedCompanyIndex].semesterStatuses[changedSemesterIndex].contactedStatus
      = Number(data[3]);
    }

    // Then in state.changedStatuses
    if (typeof changedStatuses.find(matchSemester) === 'undefined') {
      // We have to add a new semester to state.changedStatuses
      changedStatuses.push(
        {
          companyId: Number(data[0]),
          semesterId: data[2],
          value: Number(data[3]),
          year: Number(indexToSemester(index, startYear, startSem).year),
          semester: Number(indexToSemester(index, startYear, startSem).semester)
        }
      );
    } else {
      // We're changing an existing entry in state.changedStatuses
      changedStatuses.find(matchSemester).value = Number(data[3]);
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
      if (Number(status.semesterId) === semesterId) {
        changedStatuses.splice(changedStatuses.indexOf(status), 1);
      }
    }
    this.setState({ ...this.state, changedStatuses });
  }

  submitChange = () => {
    this.state.changedStatuses.forEach((status) => {
      if (status.semesterId === 'undefined') {
        this.props.addSemesterStatus(status);
      } else {
        this.props.editSemesterStatus(status);
      }
    });
    this.setState({ changedStatuses: [], submitted: true });
  };

  updateFilters = (name, value) => {
    const filters = this.state.filters;
    filters[name] = value;
    this.setState({ filters });
  }

  toggleDisplay = () => {
    this.setState({
      displayOptions: !this.state.displayOptions
    });
  }

  companySearch = (companies) => (companies.filter((company) =>
    company.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
  ));

  filterCompanies = (companies) => {
    if (this.state.searchQuery !== '') {
      companies = this.companySearch(companies);
    }
    const { filters } = this.state;
    return companies.filter((company) => {
      for (const key of Object.keys(filters)) {
        if (filters[key] !== undefined && company[key] !== filters[key]) {
          return false;
        }
      } return true;
    });
  }

  updateSearchQuery = (event) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });
  }

  render() {
    const { query } = this.props;
    const sortedCompanies = sortCompanies(this.state.companies, query, this.state.startYear,
      this.state.startSem);

    return (
      <div className={styles.root}>

        <h1>Bedriftsdatabase</h1>

        <div className={styles.search}>
          <h2>Søk</h2>
          <TextInput onChange={this.updateSearchQuery.bind(this)} />
        </div>

        <h2
          onClick={this.toggleDisplay}
          className={styles.optionsHeader}
          style={{ cursor: 'pointer' }}
        >Valg {this.state.displayOptions ?
          (<i className='fa fa-caret-down' />) : (<i className='fa fa-caret-right' />)}
        </h2>
        <OptionsBox
          companies={this.props.companies}
          updateFilters={this.updateFilters}
          display={this.state.displayOptions}
          filters={this.state.filters}
        />

        {this.state.changedStatuses.length > 0 ? (
          <Button onClick={this.submitChange} dark>Lagre endringer</Button>
        ) : ''}
        {this.state.submitted ? `${{trueIcon}} Lagret!` : ''}

        <i style={{ display: 'block' }}>
          <b>Tips:</b> Du kan endre semestere ved å trykke på dem i listen! Semestere merket med *
          er endringer klare for lagring.
        </i>

        <CompanyList
          {...this.props}
          startYear={this.state.startYear}
          startSem={this.state.startSem}
          companies={this.filterCompanies(sortedCompanies)}
          changeSemesters={this.changeSemesters}
          handleChange={this.handleChange}
          removeChangedStatus={this.removeChangedStatus}
          changedStatuses={this.state.changedStatuses}
        />

      </div>
    );
  }
}
